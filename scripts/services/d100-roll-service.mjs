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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function qualificationKey(qualification) {
  if (qualification.superCritical) {
    return qualification.success
      ? "INTERFACE.D100.Quality.SuperCriticalSuccess"
      : "INTERFACE.D100.Quality.SuperCriticalFailure";
  }
  if (qualification.automatic && qualification.critical) {
    return qualification.success
      ? "INTERFACE.D100.Quality.AutomaticCriticalSuccess"
      : "INTERFACE.D100.Quality.AutomaticCriticalFailure";
  }
  if (qualification.critical) {
    return qualification.success
      ? "INTERFACE.D100.Quality.CriticalSuccess"
      : "INTERFACE.D100.Quality.CriticalFailure";
  }
  if (qualification.automatic) {
    return qualification.success
      ? "INTERFACE.D100.Quality.AutomaticSuccess"
      : "INTERFACE.D100.Quality.AutomaticFailure";
  }
  return qualification.success
    ? "INTERFACE.D100.Quality.Success"
    : "INTERFACE.D100.Quality.Failure";
}

function modeLabel(mode) {
  return localize({
    [D100_MODES.NORMAL]: "INTERFACE.D100.Mode.Normal",
    [D100_MODES.ADVANTAGE]: "INTERFACE.D100.Mode.Advantage",
    [D100_MODES.DISADVANTAGE]: "INTERFACE.D100.Mode.Disadvantage"
  }[mode]);
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

function publicSummaryHtml(actor, result) {
  const destinyText = result.destiny.triggered
    ? `<span class="interface-d100-summary__destiny">${escapeHtml(
      localize("INTERFACE.D100.DestinyIntervened")
    )}</span>`
    : "";
  const correction = result.destiny.triggered
    ? `<span title="${escapeHtml(
      game.i18n.format("INTERFACE.D100.DestinyHover", {
        raw: result.rawResult,
        correction: result.destiny.correction,
        final: result.finalResult
      })
    )}">${result.finalResult}</span>`
    : String(result.finalResult);
  const naturalValues = result.naturalResults
    .map(entry => entry.value)
    .join(" / ");

  return `
    <div class="interface-d100-summary">
      <strong>${escapeHtml(actor.name)} — ${escapeHtml(result.source.label)}</strong>
      <span>${escapeHtml(modeLabel(result.mode))}</span>
      <span>${escapeHtml(localize("INTERFACE.D100.NaturalValues"))} : ${
        escapeHtml(naturalValues)
      }</span>
      <span>${escapeHtml(localize("INTERFACE.D100.RawResult"))} : ${
        result.rawResult
      }</span>
      <span>${escapeHtml(localize("INTERFACE.D100.Threshold"))} : ${
        result.threshold.final
      }</span>
      <span>${escapeHtml(localize("INTERFACE.D100.PreRoll.Modifier"))} : ${
        result.threshold.modifier >= 0 ? "+" : ""
      }${result.threshold.modifier}</span>
      <span>${escapeHtml(localize("INTERFACE.D100.FinalResult"))} : ${
        correction
      }</span>
      <span>${escapeHtml(localize(
        qualificationKey(result.finalQualification)
      ))}</span>
      <span>${escapeHtml(localize("INTERFACE.D100.Margin"))} : ${
        result.margin.value
      }</span>
      ${destinyText}
      <small>${escapeHtml(localize("INTERFACE.D100.DevelopmentCardHint"))}</small>
    </div>
  `;
}

async function publishDevelopmentRoll(actor, roll, result) {
  const ChatMessageClass = foundry.documents.ChatMessage;
  await roll.toMessage({
    speaker: ChatMessageClass.getSpeaker({ actor }),
    flavor: publicSummaryHtml(actor, result)
  });
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

    await publishDevelopmentRoll(actor, roll, result);

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
