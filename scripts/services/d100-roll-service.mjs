import {
  DERIVED_SCORE_DEFINITIONS,
  SETTING_KEYS,
  SKILLS,
  SYSTEM_ID,
  TALENT_GROUPS,
  TALENTS
} from "../constants.mjs";
import {
  D100_MODES,
  isD100Mode
} from "../rules/d100/constants.mjs";
import {
  prepareD100Resolution,
  resolveD100
} from "../rules/d100/resolve-d100.mjs";
import { publishD100Resolution } from "../chat/chat-message-service.mjs";

const SKILL_BY_KEY = new Map(SKILLS.map(skill => [skill.key, skill]));
const TALENT_BY_KEY = new Map(TALENTS.map(talent => [talent.key, talent]));
const TALENT_TO_SKILL = new Map(
  TALENT_GROUPS.flatMap(group =>
    group.talents.map(talent => [talent.key, group.skill])
  )
);
const ACTIVE_ACTOR_ROLLS = new WeakSet();

function localize(key) {
  return game.i18n.localize(key);
}

function sourceContext(actor, source) {
  if (source.kind === "standard") {
    const skill = SKILL_BY_KEY.get(source.skillKey);
    const talent = TALENT_BY_KEY.get(source.talentKey);
    if (!skill || !talent || TALENT_TO_SKILL.get(talent.key) !== skill.key) {
      throw new Error("Association Compétence/Talent invalide.");
    }

    const skillValue = actor.system.skills[skill.key];
    const talentValue = actor.system.talents[talent.key];
    return {
      schema: 1,
      kind: "standard",
      key: `${skill.key}:${talent.key}`,
      label: `${localize(skill.label)} + ${localize(talent.label)}`,
      displayLabel: localize(talent.label),
      baseValue: skillValue + talentValue,
      skillKey: skill.key,
      talentKey: talent.key,
      skillValue,
      talentValue
    };
  }

  if (source.kind === "derived") {
    const definition = source.key === "custom"
      ? null
      : DERIVED_SCORE_DEFINITIONS[source.key];
    const value = actor.system.derived.scores[source.key];

    if (!Number.isInteger(value)) {
      throw new Error("Valeur dérivée indisponible.");
    }

    const label = source.key === "custom"
      ? String(game.settings.get(
        SYSTEM_ID,
        SETTING_KEYS.CUSTOM_DERIVED
      )?.name ?? "").trim()
      : localize(definition.label);

    if (!label) throw new Error("Libellé de valeur dérivée indisponible.");

    return {
      schema: 1,
      kind: "derived",
      key: source.key,
      label,
      displayLabel: label,
      baseValue: value
    };
  }

  throw new Error(`Source de jet inconnue : ${source.kind}`);
}

function buildInput(actor, source, mode, modifier, naturalValues, context) {
  const normalizedSource = sourceContext(actor, source);
  const statePenalty = actor.system.derived.statePenalty;
  const baseThreshold = normalizedSource.baseValue;
  const situationalModifier = Number.isInteger(modifier) ? modifier : 0;

  return {
    schema: 1,
    source: normalizedSource,
    mode,
    state: {
      woundsValue: actor.system.resources.wounds.value,
      woundsLevel: actor.system.derived.levels.wounds,
      stressValue: actor.system.resources.stress.value,
      stressLevel: actor.system.derived.levels.stress,
      coefficient: game.settings.get(
        SYSTEM_ID,
        SETTING_KEYS.STATE_PENALTY_COEFFICIENT
      ),
      penalty: statePenalty
    },
    threshold: {
      base: baseThreshold,
      modifier: situationalModifier,
      final: baseThreshold - statePenalty + situationalModifier
    },
    destiny: {
      before: actor.system.resources.destiny.value,
      gain: game.settings.get(SYSTEM_ID, SETTING_KEYS.DESTINY_GAIN),
      cap: game.settings.get(SYSTEM_ID, SETTING_KEYS.DESTINY_CAP),
      triggerChance: game.settings.get(
        SYSTEM_ID,
        SETTING_KEYS.DESTINY_TRIGGER_CHANCE
      ),
      criticalMinimum: game.settings.get(
        SYSTEM_ID,
        SETTING_KEYS.DESTINY_CRITICAL_MINIMUM
      )
    },
    naturalValues,
    context
  };
}

function extractNaturalValues(roll) {
  return roll.dice.flatMap(die =>
    die.results
      .filter(result => result.active !== false)
      .map(result => result.result)
  );
}

async function createFoundryRoll(mode) {
  const formula = mode === D100_MODES.NORMAL ? "1d100" : "2d100";
  const roll = new Roll(formula);
  await roll.evaluate({ allowInteractive: false });
  return roll;
}

async function createSecretRoll() {
  const roll = new Roll("1d100");
  await roll.evaluate({ allowInteractive: false });
  return roll.total;
}

export async function rollD100ForActor({
  actor,
  source,
  mode = D100_MODES.NORMAL,
  modifier = 0,
  context = { kind: "general" }
}) {
  if (!actor?.canUserModify?.(game.user, "update")) {
    ui.notifications.warn(localize("INTERFACE.D100.NoPermission"));
    return null;
  }
  if (!isD100Mode(mode)) {
    ui.notifications.error(localize("INTERFACE.D100.InvalidMode"));
    return null;
  }
  if (!Number.isInteger(modifier)) {
    ui.notifications.error(localize("INTERFACE.D100.PreRoll.InvalidModifier"));
    return null;
  }
  if (ACTIVE_ACTOR_ROLLS.has(actor)) {
    ui.notifications.warn(localize("INTERFACE.D100.RollAlreadyRunning"));
    return null;
  }

  ACTIVE_ACTOR_ROLLS.add(actor);
  try {
    const roll = await createFoundryRoll(mode);
    const naturalValues = extractNaturalValues(roll);
    const input = buildInput(
      actor,
      source,
      mode,
      modifier,
      naturalValues,
      context
    );
    const prepared = prepareD100Resolution(input);
    const secretRoll = prepared.destinyEligibility.eligible
      ? await createSecretRoll()
      : null;
    const result = resolveD100(input, { secretRoll });

    if (result.destiny.after !== result.destiny.before) {
      await actor.update({
        "system.resources.destiny.value": result.destiny.after
      });
    }

    await publishD100Resolution({
      actor,
      result,
      destinyConfig: input.destiny
    });

    const publicLog = {
      actor: actor.name,
      source: result.source.label,
      mode: result.mode,
      threshold: result.threshold,
      modifier: result.threshold.modifier,
      naturalValues,
      selectedIndex: result.selectedIndex,
      rawResult: result.rawResult,
      finalResult: result.finalResult,
      finalQualification: result.finalQualification,
      margin: result.margin,
      destiny: {
        triggered: result.destiny.triggered,
        correction: result.destiny.correction,
        after: result.destiny.after
      }
    };
    console.info("D100 Interface | Jet résolu", publicLog);
    if (game.user.isGM) {
      console.debug("D100 Interface | Diagnostic MJ", result);
      return result;
    }

    return Object.freeze(publicLog);
  } catch (error) {
    console.error("D100 Interface | Échec de résolution", error);
    ui.notifications.error(
      game.i18n.format("INTERFACE.D100.RollError", {
        message: error.message
      })
    );
    return null;
  } finally {
    ACTIVE_ACTOR_ROLLS.delete(actor);
  }
}

export function standardTalentsForSkill(skillKey) {
  const group = TALENT_GROUPS.find(entry => entry.skill === skillKey);
  return group?.talents ?? [];
}
