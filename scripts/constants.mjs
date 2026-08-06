export const SYSTEM_ID = "interface";
export const PACKAGE_VERSION = "0.1.0";
export const SCHEMA_VERSION = 1;

export const FLAG_KEYS = Object.freeze({
  CREATION_PENDING: "creation.pending"
});

export const ACTOR_TYPES = Object.freeze({
  CHARACTER: "character"
});

export const ITEM_TYPES = Object.freeze({
  EQUIPMENT: "equipment"
});

export const EQUIPMENT_CATEGORIES = Object.freeze({
  ORDINARY: "ordinary",
  WEAPON: "weapon"
});

export const DEFAULT_IMAGES = Object.freeze({
  ACTOR: "systems/interface/assets/actor/avatar-default.webp",
  EQUIPMENT: Object.freeze({
    [EQUIPMENT_CATEGORIES.ORDINARY]:
      "systems/interface/assets/items/item_default.webp",
    [EQUIPMENT_CATEGORIES.WEAPON]:
      "systems/interface/assets/items/weapon_default.webp"
  })
});

export const SKILLS = Object.freeze([
  { key: "carrure", label: "INTERFACE.Skill.Carrure", tone: "corps" },
  { key: "agilite", label: "INTERFACE.Skill.Agilite", tone: "corps" },
  { key: "perception", label: "INTERFACE.Skill.Perception", tone: "ame" },
  { key: "mental", label: "INTERFACE.Skill.Mental", tone: "ame" },
  { key: "intellect", label: "INTERFACE.Skill.Intellect", tone: "esprit" },
  { key: "charisme", label: "INTERFACE.Skill.Charisme", tone: "esprit" }
]);

export const TALENT_GROUPS = Object.freeze([
  {
    skill: "carrure",
    label: "INTERFACE.Skill.Carrure",
    tone: "corps",
    talents: [
      { key: "endurance", label: "INTERFACE.Talent.Endurance" },
      { key: "forceBrute", label: "INTERFACE.Talent.ForceBrute" },
      { key: "robustesse", label: "INTERFACE.Talent.Robustesse" }
    ]
  },
  {
    skill: "agilite",
    label: "INTERFACE.Skill.Agilite",
    tone: "corps",
    talents: [
      { key: "agiliteCorporelle", label: "INTERFACE.Talent.AgiliteCorporelle" },
      { key: "precision", label: "INTERFACE.Talent.Precision" },
      { key: "reflexe", label: "INTERFACE.Talent.Reflexe" }
    ]
  },
  {
    skill: "perception",
    label: "INTERFACE.Skill.Perception",
    tone: "ame",
    talents: [
      { key: "acuiteSensorielle", label: "INTERFACE.Talent.AcuiteSensorielle" },
      { key: "sixiemeSens", label: "INTERFACE.Talent.SixiemeSens" },
      { key: "vigilance", label: "INTERFACE.Talent.Vigilance" }
    ]
  },
  {
    skill: "mental",
    label: "INTERFACE.Skill.Mental",
    tone: "ame",
    talents: [
      { key: "decision", label: "INTERFACE.Talent.Decision" },
      { key: "determination", label: "INTERFACE.Talent.Determination" },
      { key: "equilibreMental", label: "INTERFACE.Talent.EquilibreMental" }
    ]
  },
  {
    skill: "intellect",
    label: "INTERFACE.Skill.Intellect",
    tone: "esprit",
    talents: [
      { key: "creativite", label: "INTERFACE.Talent.Creativite" },
      { key: "erudition", label: "INTERFACE.Talent.Erudition" },
      { key: "logique", label: "INTERFACE.Talent.Logique" }
    ]
  },
  {
    skill: "charisme",
    label: "INTERFACE.Skill.Charisme",
    tone: "esprit",
    talents: [
      { key: "aura", label: "INTERFACE.Talent.Aura" },
      { key: "communicationExpressive", label: "INTERFACE.Talent.CommunicationExpressive" },
      { key: "persuasion", label: "INTERFACE.Talent.Persuasion" }
    ]
  }
]);

export const TALENTS = Object.freeze(
  TALENT_GROUPS.flatMap(group => group.talents)
);

function talentKeysForSkills(...skillKeys) {
  return TALENT_GROUPS
    .filter(group => skillKeys.includes(group.skill))
    .flatMap(group => group.talents.map(talent => talent.key));
}

export const DERIVED_SCORE_DEFINITIONS = Object.freeze({
  melee: Object.freeze({
    label: "INTERFACE.Derived.Melee",
    tone: "corps",
    skills: Object.freeze(["carrure", "agilite"]),
    talents: Object.freeze(talentKeysForSkills("carrure", "agilite"))
  }),
  distance: Object.freeze({
    label: "INTERFACE.Derived.Distance",
    tone: "ame",
    skills: Object.freeze(["perception", "mental"]),
    talents: Object.freeze(talentKeysForSkills("perception", "mental"))
  }),
  verbal: Object.freeze({
    label: "INTERFACE.Derived.Verbal",
    tone: "esprit",
    skills: Object.freeze(["intellect", "charisme"]),
    talents: Object.freeze(talentKeysForSkills("intellect", "charisme"))
  })
});

export const CREATION_RECOMMENDATIONS = Object.freeze({
  skills: Object.freeze([20, 30, 30, 40, 40, 50]),
  talentTotal: 100
});

export const SETTING_KEYS = Object.freeze({
  STATE_PENALTY_COEFFICIENT: "statePenaltyCoefficient",
  DESTINY_GAIN: "destinyGain",
  DESTINY_CAP: "destinyCap",
  DESTINY_TRIGGER_CHANCE: "destinyTriggerChance",
  DESTINY_CRITICAL_MINIMUM: "destinyCriticalMinimum",
  CUSTOM_DERIVED: "customDerived",
  SCHEMA_VERSION: "schemaVersion"
});

export const DEFAULT_SETTINGS = Object.freeze({
  [SETTING_KEYS.STATE_PENALTY_COEFFICIENT]: 3,
  [SETTING_KEYS.DESTINY_GAIN]: 5,
  [SETTING_KEYS.DESTINY_CAP]: 30,
  [SETTING_KEYS.DESTINY_TRIGGER_CHANCE]: 80,
  [SETTING_KEYS.DESTINY_CRITICAL_MINIMUM]: 15,
  [SETTING_KEYS.CUSTOM_DERIVED]: Object.freeze({
    enabled: false,
    name: "",
    skills: Object.freeze([]),
    talents: Object.freeze([])
  }),
  [SETTING_KEYS.SCHEMA_VERSION]: 0
});
