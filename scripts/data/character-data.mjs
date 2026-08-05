import {
  DEFAULT_SETTINGS,
  SETTING_KEYS,
  SKILLS,
  SYSTEM_ID,
  TALENTS
} from "../constants.mjs";
import { buildCharacterDerivedData } from "../rules/derived-values.mjs";
import { booleanField, htmlField, integerField, textField } from "./fields.mjs";

const fields = foundry.data.fields;

function makeNumberSchema(entries, { max }) {
  return Object.fromEntries(
    entries.map(({ key }) => [key, integerField({ min: 0, max, initial: 0 })])
  );
}

function makeGainSchema() {
  return new fields.SchemaField({
    first: booleanField(),
    second: booleanField(),
    third: booleanField()
  });
}

function getWorldSetting(key) {
  try {
    return game.settings.get(SYSTEM_ID, key);
  } catch {
    return DEFAULT_SETTINGS[key];
  }
}

export class CharacterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      identity: new fields.SchemaField({
        age: textField(),
        profession: textField(),
        specializations: textField(),
        notes: htmlField()
      }),
      skills: new fields.SchemaField(
        makeNumberSchema(SKILLS, { max: 100 })
      ),
      talents: new fields.SchemaField(
        makeNumberSchema(TALENTS, { max: 30 })
      ),
      resources: new fields.SchemaField({
        wounds: new fields.SchemaField({
          value: integerField({ min: 0, max: 15, initial: 0 })
        }),
        stress: new fields.SchemaField({
          value: integerField({ min: 0, max: 15, initial: 0 })
        }),
        destiny: new fields.SchemaField({
          value: integerField({ min: 0, initial: 0 })
        })
      }),
      progression: new fields.SchemaField({
        gauge: integerField({ min: 0, max: 3, initial: 0 }),
        skillGains: makeGainSchema(),
        talentGains: makeGainSchema(),
        specializationGains: makeGainSchema()
      }),
      derived: new fields.ObjectField({
        required: true,
        nullable: false,
        persisted: false,
        initial: {}
      })
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData();

    this.derived = buildCharacterDerivedData({
      skills: this.skills,
      talents: this.talents,
      wounds: this.resources.wounds.value,
      stress: this.resources.stress.value,
      statePenaltyCoefficient: getWorldSetting(
        SETTING_KEYS.STATE_PENALTY_COEFFICIENT
      ),
      customDerived: getWorldSetting(SETTING_KEYS.CUSTOM_DERIVED)
    });
  }
}
