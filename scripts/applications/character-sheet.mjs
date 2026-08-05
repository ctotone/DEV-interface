import {
  CREATION_RECOMMENDATIONS,
  DERIVED_SCORE_DEFINITIONS,
  EQUIPMENT_CATEGORIES,
  ITEM_TYPES,
  SETTING_KEYS,
  SKILLS,
  SYSTEM_ID,
  TALENT_GROUPS
} from "../constants.mjs";

const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

const RESOURCE_KEYS = new Set(["wounds", "stress"]);
const DEFAULT_SECTION_STATE = Object.freeze({
  development: false,
  talents: true,
  combat: true,
  specializations: false,
  inventory: true,
  notes: false
});

function itemView(item) {
  const isWeapon = item.system.category === EQUIPMENT_CATEGORIES.WEAPON;

  return {
    id: item.id,
    name: item.name,
    img: item.img,
    quantity: item.system.quantity,
    category: item.system.category,
    categoryLabel: isWeapon
      ? "INTERFACE.Equipment.CategoryWeapon"
      : "INTERFACE.Equipment.CategoryOrdinary",
    isWeapon,
    damageFormula: item.system.damage.formula
  };
}

function creationWarningMessage(code, creation) {
  switch (code) {
    case "skills":
      return game.i18n.format("INTERFACE.Creation.WarningSkills", {
        values: creation.skillValues.join(" / ")
      });
    case "talents-under":
      return game.i18n.format("INTERFACE.Creation.WarningTalentsUnder", {
        total: creation.talentTotal,
        remaining: CREATION_RECOMMENDATIONS.talentTotal - creation.talentTotal
      });
    case "talents-over":
      return game.i18n.format("INTERFACE.Creation.WarningTalentsOver", {
        total: creation.talentTotal,
        excess: creation.talentTotal - CREATION_RECOMMENDATIONS.talentTotal
      });
    default:
      return code;
  }
}

function buildStateTrack(level) {
  return Array.from({ length: 6 }, (_, value) => ({
    value,
    current: value === level
  }));
}

function buildProgressionGroup(system, key, label, detail) {
  return {
    key,
    label,
    detail,
    gains: ["first", "second", "third"].map((gain, index) => ({
      key: gain,
      index: index + 1,
      checked: system.progression[key][gain] === true
    }))
  };
}

async function adjustResourceAction(event, target) {
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

async function createEquipmentAction(event, target) {
  const category = target.dataset.category;
  if (!Object.values(EQUIPMENT_CATEGORIES).includes(category)) return;
  if (!this.actor.canUserModify(game.user, "update")) return;

  await this.submit();

  const nameKey = category === EQUIPMENT_CATEGORIES.WEAPON
    ? "INTERFACE.Inventory.NewWeapon"
    : "INTERFACE.Inventory.NewOrdinary";

  const [item] = await this.actor.createEmbeddedDocuments("Item", [{
    name: game.i18n.localize(nameKey),
    type: ITEM_TYPES.EQUIPMENT,
    system: {
      category
    }
  }]);

  await item?.sheet?.render({ force: true });
}

async function editEmbeddedItemAction(event, target) {
  const row = target.closest("[data-item-id]");
  const item = this.actor.items.get(row?.dataset.itemId);
  await item?.sheet?.render({ force: true });
}

function creationSignature(creation) {
  return JSON.stringify({
    skillValues: creation.skillValues,
    talentTotal: creation.talentTotal,
    warnings: creation.warnings
  });
}

function acknowledgeCreationWarningsAction() {
  this.acknowledgedCreationSignature = creationSignature(
    this.actor.system.derived.creation
  );
  return this.render();
}

export class InterfaceCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  acknowledgedCreationSignature = null;
  sectionState = { ...DEFAULT_SECTION_STATE };

  static DEFAULT_OPTIONS = {
    classes: ["interface", "interface-sheet", "interface-character-sheet"],
    tag: "form",
    position: {
      width: 860,
      height: 880
    },
    actions: {
      adjustResource: adjustResourceAction,
      createEquipment: createEquipmentAction,
      editEmbeddedItem: editEmbeddedItemAction,
      acknowledgeCreationWarnings: acknowledgeCreationWarningsAction
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
    const customDerived = game.settings.get(
      SYSTEM_ID,
      SETTING_KEYS.CUSTOM_DERIVED
    );
    const statePenaltyCoefficient = game.settings.get(
      SYSTEM_ID,
      SETTING_KEYS.STATE_PENALTY_COEFFICIENT
    );
    const creationWarnings = derived.creation.warnings.map(code => ({
      code,
      message: creationWarningMessage(code, derived.creation)
    }));
    const warningsAcknowledged = creationWarnings.length > 0
      && this.acknowledgedCreationSignature
        === creationSignature(derived.creation);

    return {
      ...context,
      actor: this.actor,
      system,
      derived,
      sections: this.sectionState,
      statePenaltyCoefficient,
      woundTrack: buildStateTrack(derived.levels.wounds),
      stressTrack: buildStateTrack(derived.levels.stress),
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
      talentGroups: TALENT_GROUPS.map(group => ({
        ...group,
        talents: group.talents.map(talent => ({
          ...talent,
          value: system.talents[talent.key]
        }))
      })),
      creation: {
        ...derived.creation,
        warnings: creationWarnings,
        acknowledged: warningsAcknowledged,
        showWarnings: creationWarnings.length > 0
          && !warningsAcknowledged
      },
      progressionGauge: [0, 1, 2, 3].map(value => ({
        value,
        checked: system.progression.gauge === value
      })),
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
      inventory: embeddedEquipment,
      weapons,
      hasInventory: embeddedEquipment.length > 0,
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
  }
}
