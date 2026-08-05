import {
  DEFAULT_SETTINGS,
  SETTING_KEYS,
  SYSTEM_ID
} from "../constants.mjs";
import { InterfaceSettingsApplication } from "../applications/interface-settings-application.mjs";

const fields = foundry.data.fields;

function numberField({ min = 0, max = undefined, initial }) {
  return new fields.NumberField({
    required: true,
    nullable: false,
    integer: true,
    min,
    max,
    initial
  });
}

function refreshActorDerivedData() {
  for (const actor of game.actors ?? []) {
    actor.prepareData();
    actor.render(false);
  }
}

function customDerivedDefault() {
  const value = DEFAULT_SETTINGS[SETTING_KEYS.CUSTOM_DERIVED];

  return {
    enabled: value.enabled,
    name: value.name,
    skills: [...value.skills],
    talents: [...value.talents]
  };
}

function registerNumberSetting(
  key,
  { min = 0, max = undefined, onChange = undefined } = {}
) {
  const defaultValue = DEFAULT_SETTINGS[key];

  const setting = {
    name: `INTERFACE.Settings.${key}.Name`,
    hint: `INTERFACE.Settings.${key}.Hint`,
    scope: "world",
    config: false,
    type: numberField({ min, max, initial: defaultValue }),
    default: defaultValue
  };

  if (onChange) setting.onChange = onChange;
  game.settings.register(SYSTEM_ID, key, setting);
}

export function registerInterfaceSettings() {
  registerNumberSetting(SETTING_KEYS.STATE_PENALTY_COEFFICIENT, {
    onChange: refreshActorDerivedData
  });
  registerNumberSetting(SETTING_KEYS.DESTINY_GAIN);
  registerNumberSetting(SETTING_KEYS.DESTINY_CAP);
  registerNumberSetting(SETTING_KEYS.DESTINY_TRIGGER_CHANCE, {
    min: 0,
    max: 100
  });
  registerNumberSetting(SETTING_KEYS.DESTINY_CRITICAL_MINIMUM);

  game.settings.register(SYSTEM_ID, SETTING_KEYS.CUSTOM_DERIVED, {
    name: `INTERFACE.Settings.${SETTING_KEYS.CUSTOM_DERIVED}.Name`,
    hint: `INTERFACE.Settings.${SETTING_KEYS.CUSTOM_DERIVED}.Hint`,
    scope: "world",
    config: false,
    type: new fields.ObjectField({
      required: true,
      nullable: false,
      initial: customDerivedDefault()
    }),
    default: customDerivedDefault(),
    onChange: refreshActorDerivedData
  });

  game.settings.register(SYSTEM_ID, SETTING_KEYS.SCHEMA_VERSION, {
    name: `INTERFACE.Settings.${SETTING_KEYS.SCHEMA_VERSION}.Name`,
    hint: `INTERFACE.Settings.${SETTING_KEYS.SCHEMA_VERSION}.Hint`,
    scope: "world",
    config: false,
    type: numberField({
      min: 0,
      initial: DEFAULT_SETTINGS[SETTING_KEYS.SCHEMA_VERSION]
    }),
    default: DEFAULT_SETTINGS[SETTING_KEYS.SCHEMA_VERSION]
  });

  game.settings.registerMenu(SYSTEM_ID, "configuration", {
    name: "INTERFACE.Settings.MenuName",
    label: "INTERFACE.Settings.MenuLabel",
    hint: "INTERFACE.Settings.MenuHint",
    icon: "fa-solid fa-gears",
    type: InterfaceSettingsApplication,
    restricted: true
  });
}
