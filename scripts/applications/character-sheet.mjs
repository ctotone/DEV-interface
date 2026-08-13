import { InterfaceCharacterCreationApplication } from "./character-creation-application.mjs";
import {
  DEFAULT_IMAGES,
  DERIVED_SCORE_DEFINITIONS,
  EQUIPMENT_CATEGORIES,
  FLAG_KEYS,
  ITEM_TYPES,
  SETTING_KEYS,
  SKILLS,
  SYSTEM_ID,
  TALENT_GROUPS
} from "../constants.mjs";
import { D100_MODES } from "../rules/d100/constants.mjs";
import { standardTalentsForSkill } from "../services/d100-roll-service.mjs";
import {
  interfaceThemeClass,
  normalizeInterfaceTheme,
  resolveActorTheme
} from "../services/theme-service.mjs";
import {
  canRollInitiativeFromSheet,
  rollActorInitiativeFromSheet
} from "../services/initiative-service.mjs";

const { ActorSheetV2 } = foundry.applications.sheets;
const {
  DialogV2,
  HandlebarsApplicationMixin
} = foundry.applications.api;
const { FilePicker } = foundry.applications.apps;

const RESOURCE_KEYS = new Set(["wounds", "stress"]);
const DEFAULT_SECTION_STATE = Object.freeze({
  skills: true,
  talents: true,
  combat: true,
  weapons: true,
  specializations: false,
  inventory: true,
  notes: false
});


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function canUpdateActor(sheet) {
  return sheet.actor?.canUserModify?.(game.user, "update") ?? true;
}

async function choosePortraitAction() {
  if (!canUpdateActor(this)) return null;

  await this.submit();
  const picker = new FilePicker({
    type: "image",
    current: this.actor.img,
    callback: path => this.actor.update({ img: path })
  });
  return picker.render({ force: true });
}

function itemView(item) {
  const isWeapon = item.system.category === EQUIPMENT_CATEGORIES.WEAPON;

  return {
    id: item.id,
    name: item.name,
    img: String(item.img ?? "").trim()
      || DEFAULT_IMAGES.EQUIPMENT[item.system.category],
    quantity: item.system.quantity,
    category: item.system.category,
    categoryLabel: isWeapon
      ? "INTERFACE.Equipment.CategoryWeapon"
      : "INTERFACE.Equipment.CategoryOrdinary",
    deleteLabel: isWeapon
      ? "INTERFACE.Inventory.DeleteWeapon"
      : "INTERFACE.Inventory.DeleteOrdinary",
    isWeapon,
    damageFormula: item.system.damage.formula
  };
}

const STATE_PRESENTATION = Object.freeze([
  Object.freeze({
    wounds: "INTERFACE.State.Wounds.Indemne",
    stress: "INTERFACE.State.Stress.Stable"
  }),
  Object.freeze({
    wounds: "INTERFACE.State.Wounds.Touche",
    stress: "INTERFACE.State.Stress.Tendu"
  }),
  Object.freeze({
    wounds: "INTERFACE.State.Wounds.Meurtri",
    stress: "INTERFACE.State.Stress.Eprouve"
  }),
  Object.freeze({
    wounds: "INTERFACE.State.Wounds.Blesse",
    stress: "INTERFACE.State.Stress.Ebranle"
  }),
  Object.freeze({
    wounds: "INTERFACE.State.Wounds.Brisse",
    stress: "INTERFACE.State.Stress.Submerge"
  }),
  Object.freeze({
    wounds: "INTERFACE.State.Wounds.Critique",
    stress: "INTERFACE.State.Stress.Rupture"
  })
]);

function buildStatePresentation(resource, level) {
  const normalizedLevel = Number.isInteger(level)
    ? Math.min(5, Math.max(0, level))
    : 0;
  const presentation = STATE_PRESENTATION[normalizedLevel];

  return {
    level: normalizedLevel,
    label: presentation[resource]
  };
}

function buildProgressionGroup(system, key, label, detail) {
  const gainKeys = ["first", "second", "third"];
  const checkedStates = gainKeys.map(gain => (
    system.progression[key][gain] === true
  ));

  return {
    key,
    label,
    detail,
    gains: gainKeys.map((gain, index) => {
      const checked = checkedStates[index];
      const previousChecked = index === 0 || checkedStates[index - 1] === true;
      const nextChecked = index < checkedStates.length - 1
        && checkedStates[index + 1] === true;

      return {
        key: gain,
        index: index + 1,
        checked,
        disabled: checked ? nextChecked : !previousChecked
      };
    })
  };
}

async function adjustResourceAction(event, target) {
  if (!canUpdateActor(this)) return;
  const resource = target.dataset.resource;
  const delta = Number.parseInt(target.dataset.delta ?? "0", 10);
  if (!RESOURCE_KEYS.has(resource) || !Number.isInteger(delta)) return;

  const fieldName = `system.resources.${resource}.value`;
  const input = this.form?.elements.namedItem(fieldName);
  const current = Number.parseInt(
    input?.value ?? this.actor.system.resources[resource].value,
    10
  );
  const next = Math.min(15, Math.max(0, current + delta));

  if (input) input.value = String(next);
  await this.submit();
}

async function createEquipment(sheet, category) {
  if (!Object.values(EQUIPMENT_CATEGORIES).includes(category)) return null;
  if (!sheet.actor.canUserModify(game.user, "update")) return null;

  await sheet.submit();

  const nameKey = category === EQUIPMENT_CATEGORIES.WEAPON
    ? "INTERFACE.Inventory.NewWeapon"
    : "INTERFACE.Inventory.NewOrdinary";

  const [item] = await sheet.actor.createEmbeddedDocuments("Item", [{
    name: game.i18n.localize(nameKey),
    type: ITEM_TYPES.EQUIPMENT,
    img: DEFAULT_IMAGES.EQUIPMENT[category],
    system: {
      category
    }
  }]);

  await item?.sheet?.render({ force: true });
  return item ?? null;
}

async function createEquipmentAction(event, target) {
  event.preventDefault();
  event.stopPropagation();
  return createEquipment(this, target.dataset.category);
}

async function chooseEquipmentCategoryAction(event) {
  event.preventDefault();
  event.stopPropagation();
  if (!canUpdateActor(this)) return null;

  const theme = normalizeInterfaceTheme(resolveActorTheme(this.actor));
  const category = await DialogV2.wait({
    classes: ["interface", interfaceThemeClass(theme), "interface-equipment-choice-dialog"],
    window: {
      title: game.i18n.localize("INTERFACE.Inventory.AddTitle")
    },
    content: `<div data-interface-theme="${theme}"><p>${game.i18n.localize("INTERFACE.Inventory.AddPrompt")}</p></div>`,
    buttons: [
      {
        action: EQUIPMENT_CATEGORIES.ORDINARY,
        label: game.i18n.localize("INTERFACE.Inventory.DialogOrdinary"),
        default: true,
        callback: () => EQUIPMENT_CATEGORIES.ORDINARY
      },
      {
        action: EQUIPMENT_CATEGORIES.WEAPON,
        label: game.i18n.localize("INTERFACE.Inventory.DialogWeapon"),
        callback: () => EQUIPMENT_CATEGORIES.WEAPON
      }
    ],
    rejectClose: false,
    modal: true
  });

  if (!category) return null;
  return createEquipment(this, category);
}

async function editEmbeddedItemAction(event, target) {
  if (!canUpdateActor(this)) return;
  const row = target.closest("[data-item-id]");
  const item = this.actor.items.get(row?.dataset.itemId);
  await item?.sheet?.render({ force: true });
}

async function deleteEmbeddedItemAction(event, target) {
  event.preventDefault();
  event.stopPropagation();
  if (!canUpdateActor(this)) return null;

  const row = target.closest("[data-item-id]");
  const item = this.actor.items.get(row?.dataset.itemId);
  if (!item) return null;

  const theme = normalizeInterfaceTheme(resolveActorTheme(this.actor));
  const confirmed = await DialogV2.confirm({
    classes: ["interface", interfaceThemeClass(theme), "interface-delete-equipment-dialog"],
    window: {
      title: game.i18n.localize("INTERFACE.Inventory.DeleteTitle")
    },
    content: `
      <div data-interface-theme="${theme}">
      <p>${game.i18n.format("INTERFACE.Inventory.DeletePrompt", {
        name: escapeHtml(item.name)
      })}</p>
      <p class="hint">${game.i18n.localize("INTERFACE.Inventory.DeleteWarning")}</p>
      </div>
    `,
    yes: {
      label: game.i18n.localize("INTERFACE.Inventory.DeleteConfirm"),
      icon: "fa-solid fa-trash"
    },
    no: {
      label: game.i18n.localize("INTERFACE.Inventory.DeleteCancel")
    },
    rejectClose: false,
    modal: true
  });

  if (!confirmed) return null;
  await item.delete();
  return item;
}

const TALENT_DISPLAY_ORDER = Object.freeze([
  "carrure",
  "perception",
  "intellect",
  "agilite",
  "mental",
  "charisme"
]);

const TALENT_DISPLAY_INDEX = new Map(
  TALENT_DISPLAY_ORDER.map((key, index) => [key, index])
);

function standardRollLabel(skillKey, talentKey) {
  const skill = SKILLS.find(entry => entry.key === skillKey);
  const talent = TALENT_GROUPS
    .flatMap(group => group.talents)
    .find(entry => entry.key === talentKey);
  if (!skill || !talent) return "";

  return `${game.i18n.localize(skill.label)} + ${game.i18n.localize(talent.label)}`;
}

function derivedRollLabel(key) {
  if (key === "custom") {
    return String(game.settings.get(
      SYSTEM_ID,
      SETTING_KEYS.CUSTOM_DERIVED
    )?.name ?? "").trim();
  }

  const definition = DERIVED_SCORE_DEFINITIONS[key];
  return definition ? game.i18n.localize(definition.label) : "";
}

async function requestRollOptions(sourceLabel, theme) {
  const resolvedTheme = normalizeInterfaceTheme(theme);
  const result = await DialogV2.input({
    classes: [
      "interface",
      interfaceThemeClass(resolvedTheme),
      "interface-preroll-dialog"
    ],
    window: {
      title: game.i18n.format("INTERFACE.D100.PreRoll.Title", {
        source: sourceLabel
      })
    },
    position: {
      width: 380
    },
    content: `
      <div class="interface-preroll" data-interface-theme="${resolvedTheme}">
        <div class="interface-preroll__source">${escapeHtml(sourceLabel)}</div>
        <fieldset class="interface-preroll__mode">
          <legend>${game.i18n.localize("INTERFACE.D100.PreRoll.Mode")}</legend>
          <div class="interface-preroll-mode">
            <label class="interface-preroll-mode__option interface-preroll-mode__option--disadvantage">
              <input
                type="radio"
                name="mode"
                value="${D100_MODES.DISADVANTAGE}"
              >
              <span>${game.i18n.localize("INTERFACE.D100.Mode.Disadvantage")}</span>
            </label>
            <label class="interface-preroll-mode__option interface-preroll-mode__option--normal">
              <input
                type="radio"
                name="mode"
                value="${D100_MODES.NORMAL}"
                checked
              >
              <span>${game.i18n.localize("INTERFACE.D100.Mode.Normal")}</span>
            </label>
            <label class="interface-preroll-mode__option interface-preroll-mode__option--advantage">
              <input
                type="radio"
                name="mode"
                value="${D100_MODES.ADVANTAGE}"
              >
              <span>${game.i18n.localize("INTERFACE.D100.Mode.Advantage")}</span>
            </label>
          </div>
        </fieldset>
        <label class="interface-preroll__field">
          <span>${game.i18n.localize("INTERFACE.D100.PreRoll.Modifier")}</span>
          <input name="modifier" type="number" value="0" step="1">
          <small>${game.i18n.localize("INTERFACE.D100.PreRoll.ModifierHint")}</small>
        </label>
      </div>
    `,
    ok: {
      label: game.i18n.localize("INTERFACE.D100.PreRoll.Roll")
    },
    rejectClose: false,
    modal: true
  });

  if (!result) return null;

  const mode = String(result.mode ?? "");
  const modifier = Number.parseInt(String(result.modifier ?? "0"), 10);
  if (!Object.values(D100_MODES).includes(mode)) {
    ui.notifications.error(game.i18n.localize("INTERFACE.D100.InvalidMode"));
    return null;
  }
  if (!Number.isInteger(modifier)) {
    ui.notifications.error(
      game.i18n.localize("INTERFACE.D100.PreRoll.InvalidModifier")
    );
    return null;
  }

  return Object.freeze({ mode, modifier });
}

async function executeRoll(sheet, target, callback) {
  if (!canUpdateActor(sheet)) return null;
  target.disabled = true;
  try {
    await sheet.submit();
    return await callback();
  } finally {
    if (target.isConnected) target.disabled = false;
  }
}

async function rollTalentAction(event, target) {
  const skillKey = target.dataset.skillKey;
  const talentKey = target.dataset.talentKey;

  return executeRoll(this, target, async () => {
    const options = await requestRollOptions(
      standardRollLabel(skillKey, talentKey),
      resolveActorTheme(this.actor)
    );
    if (!options) return null;

    return this.actor.rollStandardD100({
      skillKey,
      talentKey,
      ...options
    });
  });
}

async function chooseTalentForSkill(sheet, skillKey) {
  const talents = standardTalentsForSkill(skillKey);
  const skill = SKILLS.find(entry => entry.key === skillKey);
  if (!skill || talents.length === 0) return null;

  return DialogV2.wait({
    window: {
      title: game.i18n.format("INTERFACE.D100.ChooseTalentTitle", {
        skill: game.i18n.localize(skill.label)
      })
    },
    content: `<p>${game.i18n.localize(
      "INTERFACE.D100.ChooseTalentHint"
    )}</p>`,
    buttons: talents.map((talent, index) => ({
      action: talent.key,
      label: `${game.i18n.localize(talent.label)} (${
        sheet.actor.system.talents[talent.key]
      })`,
      default: index === 0,
      callback: () => talent.key
    })),
    rejectClose: false,
    modal: true
  });
}

// Conservé volontairement pour une éventuelle réactivation future.
// Aucun élément du template ne référence actuellement cette action.
async function rollSkillAction(event, target) {
  if (!canUpdateActor(this)) return null;
  const skillKey = target.dataset.skillKey;
  target.disabled = true;

  try {
    await this.submit();
    const talentKey = await chooseTalentForSkill(this, skillKey);
    if (!talentKey) return null;

    const options = await requestRollOptions(
      standardRollLabel(skillKey, talentKey),
      resolveActorTheme(this.actor)
    );
    if (!options) return null;

    return this.actor.rollStandardD100({
      skillKey,
      talentKey,
      ...options
    });
  } finally {
    if (target.isConnected) target.disabled = false;
  }
}

async function rollDerivedAction(event, target) {
  const key = target.dataset.derivedKey;

  return executeRoll(this, target, async () => {
    const options = await requestRollOptions(
      derivedRollLabel(key),
      resolveActorTheme(this.actor)
    );
    if (!options) return null;

    return this.actor.rollDerivedD100({
      key,
      ...options
    });
  });
}

async function rollInitiativeAction(event, target) {
  event.preventDefault();

  if (!canRollInitiativeFromSheet(this.actor)) return null;

  target.disabled = true;
  try {
    await this.submit();
    return await rollActorInitiativeFromSheet(this.actor);
  } catch (error) {
    console.error(
      "D100 Interface | Échec du jet d’initiative depuis la fiche",
      error
    );
    ui.notifications.error(
      game.i18n.format("INTERFACE.Initiative.RollError", {
        message: error?.message ?? String(error)
      })
    );
    return null;
  } finally {
    if (target.isConnected) {
      target.disabled = !canRollInitiativeFromSheet(this.actor);
    }
  }
}

export class InterfaceCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  sectionState = { ...DEFAULT_SECTION_STATE };

  async render(options = {}, legacyOptions = {}) {
    const creationPending = this.actor.getFlag(
      SYSTEM_ID,
      FLAG_KEYS.CREATION_PENDING
    ) === true;

    if (creationPending && canUpdateActor(this)) {
      const renderOptions = typeof options === "boolean"
        ? { ...legacyOptions, force: options }
        : { ...legacyOptions, ...options };

      await InterfaceCharacterCreationApplication.openForActor({
        actor: this.actor,
        renderOptions
      });
      return this;
    }

    return super.render(options, legacyOptions);
  }

  static DEFAULT_OPTIONS = {
    classes: ["interface", "interface-sheet", "interface-character-sheet"],
    tag: "form",
    position: {
      width: 860,
      height: 880
    },
    window: {
      resizable: true
    },
    actions: {
      adjustResource: adjustResourceAction,
      createEquipment: createEquipmentAction,
      chooseEquipmentCategory: chooseEquipmentCategoryAction,
      editEmbeddedItem: editEmbeddedItemAction,
      deleteEmbeddedItem: deleteEmbeddedItemAction,
      choosePortrait: choosePortraitAction,
      rollSkill: rollSkillAction,
      rollTalent: rollTalentAction,
      rollDerived: rollDerivedAction,
      rollInitiative: rollInitiativeAction
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    }
  };

  static PARTS = {
    form: {
      template: "systems/interface/templates/actor/character-sheet.hbs",
      scrollable: [".interface-sheet__body"]
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const system = this.actor.system.toObject();
    const derived = this.actor.system.derived;
    const embeddedEquipment = this.actor.items
      .filter(item => item.type === ITEM_TYPES.EQUIPMENT)
      .map(itemView);
    const weapons = embeddedEquipment.filter(item => item.isWeapon);
    const inventory = embeddedEquipment.filter(item => !item.isWeapon);
    const customDerived = game.settings.get(
      SYSTEM_ID,
      SETTING_KEYS.CUSTOM_DERIVED
    );
    const readOnly = !canUpdateActor(this);

    return {
      ...context,
      actor: this.actor,
      system,
      theme: resolveActorTheme(this.actor),
      readOnly,
      derived,
      initiativeCanRoll: canRollInitiativeFromSheet(this.actor),
      sections: this.sectionState,
      woundState: buildStatePresentation("wounds", derived.levels.wounds),
      stressState: buildStatePresentation("stress", derived.levels.stress),
      derivedScores: Object.entries(DERIVED_SCORE_DEFINITIONS).map(
        ([key, definition]) => ({
          key,
          label: definition.label,
          tone: definition.tone,
          value: derived.scores[key]
        })
      ),
      customDerived: {
        enabled: customDerived.enabled === true,
        available: derived.scores.custom !== null,
        name: customDerived.name,
        value: derived.scores.custom
      },
      skills: SKILLS.map(skill => ({
        ...skill,
        value: system.skills[skill.key]
      })),
      talentGroups: [...TALENT_GROUPS]
        .sort((left, right) => (
          (TALENT_DISPLAY_INDEX.get(left.skill) ?? 99)
          - (TALENT_DISPLAY_INDEX.get(right.skill) ?? 99)
        ))
        .map(group => ({
          ...group,
          skillValue: system.skills[group.skill],
          talents: group.talents.map(talent => ({
            ...talent,
            value: system.talents[talent.key]
          }))
        })),
      progressionGauge: [0, 1, 2, 3].map(value => ({
        value,
        checked: system.progression.gauge === value
      })),
      progressionReady: system.progression.gauge === 3,
      progressionGroups: [
        buildProgressionGroup(
          system,
          "skillGains",
          "INTERFACE.Progression.SkillGain",
          "INTERFACE.Progression.SkillGainDetail"
        ),
        buildProgressionGroup(
          system,
          "talentGains",
          "INTERFACE.Progression.TalentGain",
          "INTERFACE.Progression.TalentGainDetail"
        ),
        buildProgressionGroup(
          system,
          "specializationGains",
          "INTERFACE.Progression.SpecializationGain",
          "INTERFACE.Progression.SpecializationGainDetail"
        )
      ],
      inventory,
      weapons,
      hasInventory: inventory.length > 0,
      hasWeapons: weapons.length > 0,
      categories: EQUIPMENT_CATEGORIES
    };
  }

  async _postRender(context, options) {
    await super._postRender(context, options);

    for (const section of this.element.querySelectorAll("details[data-section]")) {
      section.addEventListener("toggle", () => {
        this.sectionState[section.dataset.section] = section.open;
      });
    }

    if (!canUpdateActor(this)) {
      const blockDocumentInteraction = event => {
        event.preventDefault();
        event.stopImmediatePropagation();
      };
      this.element.addEventListener("dragstart", blockDocumentInteraction, true);
      this.element.addEventListener("dragover", blockDocumentInteraction, true);
      this.element.addEventListener("drop", blockDocumentInteraction, true);
    }
  }
}
