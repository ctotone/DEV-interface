import {
  DEFAULT_SETTINGS,
  SETTING_KEYS,
  SKILLS,
  SYSTEM_ID,
  TALENTS
} from "../constants.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

function getInteger(form, name) {
  const element = form.elements.namedItem(name);
  return Number.parseInt(element?.value ?? "", 10);
}

function setFieldValue(form, name, value) {
  const element = form.elements.namedItem(name);
  if (element) element.value = String(value);
}

function loadDefaultsAction() {
  const form = this.form;
  if (!form) return;

  setFieldValue(
    form,
    SETTING_KEYS.STATE_PENALTY_COEFFICIENT,
    DEFAULT_SETTINGS[SETTING_KEYS.STATE_PENALTY_COEFFICIENT]
  );
  setFieldValue(
    form,
    SETTING_KEYS.DESTINY_GAIN,
    DEFAULT_SETTINGS[SETTING_KEYS.DESTINY_GAIN]
  );
  setFieldValue(
    form,
    SETTING_KEYS.DESTINY_CAP,
    DEFAULT_SETTINGS[SETTING_KEYS.DESTINY_CAP]
  );
  setFieldValue(
    form,
    SETTING_KEYS.DESTINY_TRIGGER_CHANCE,
    DEFAULT_SETTINGS[SETTING_KEYS.DESTINY_TRIGGER_CHANCE]
  );
  setFieldValue(
    form,
    SETTING_KEYS.DESTINY_CRITICAL_MINIMUM,
    DEFAULT_SETTINGS[SETTING_KEYS.DESTINY_CRITICAL_MINIMUM]
  );

  const enabled = form.elements.namedItem("customDerived.enabled");
  if (enabled) enabled.checked = false;
}

async function submitSettings(event, form) {
  const values = {
    [SETTING_KEYS.STATE_PENALTY_COEFFICIENT]: getInteger(
      form,
      SETTING_KEYS.STATE_PENALTY_COEFFICIENT
    ),
    [SETTING_KEYS.DESTINY_GAIN]: getInteger(form, SETTING_KEYS.DESTINY_GAIN),
    [SETTING_KEYS.DESTINY_CAP]: getInteger(form, SETTING_KEYS.DESTINY_CAP),
    [SETTING_KEYS.DESTINY_TRIGGER_CHANCE]: getInteger(
      form,
      SETTING_KEYS.DESTINY_TRIGGER_CHANCE
    ),
    [SETTING_KEYS.DESTINY_CRITICAL_MINIMUM]: getInteger(
      form,
      SETTING_KEYS.DESTINY_CRITICAL_MINIMUM
    )
  };

  const numericRules = [
    [SETTING_KEYS.STATE_PENALTY_COEFFICIENT, 0, null],
    [SETTING_KEYS.DESTINY_GAIN, 0, null],
    [SETTING_KEYS.DESTINY_CAP, 0, null],
    [SETTING_KEYS.DESTINY_TRIGGER_CHANCE, 0, 100],
    [SETTING_KEYS.DESTINY_CRITICAL_MINIMUM, 0, null]
  ];

  for (const [key, min, max] of numericRules) {
    const value = values[key];
    const valid = Number.isInteger(value)
      && value >= min
      && (max === null || value <= max);

    if (!valid) {
      ui.notifications.error(
        game.i18n.format("INTERFACE.Settings.InvalidNumber", {
          setting: game.i18n.localize(`INTERFACE.Settings.${key}.Name`)
        })
      );
      return;
    }
  }

  const customDerived = {
    enabled: Boolean(
      form.elements.namedItem("customDerived.enabled")?.checked
    ),
    name: String(
      form.elements.namedItem("customDerived.name")?.value ?? ""
    ).trim(),
    skills: Array.from(
      form.querySelectorAll('input[name="customDerived.skills"]:checked'),
      input => input.value
    ),
    talents: Array.from(
      form.querySelectorAll('input[name="customDerived.talents"]:checked'),
      input => input.value
    )
  };

  if (customDerived.enabled) {
    const valid = customDerived.name.length > 0
      && new Set(customDerived.skills).size === 2
      && customDerived.skills.length === 2
      && new Set(customDerived.talents).size === 6
      && customDerived.talents.length === 6
      && customDerived.skills.every(key => SKILLS.some(skill => skill.key === key))
      && customDerived.talents.every(key => TALENTS.some(talent => talent.key === key));

    if (!valid) {
      ui.notifications.error(game.i18n.localize("INTERFACE.Settings.CustomDerived.Invalid"));
      return;
    }
  }


  for (const [key, value] of Object.entries(values)) {
    await game.settings.set(SYSTEM_ID, key, value);
  }
  await game.settings.set(
    SYSTEM_ID,
    SETTING_KEYS.CUSTOM_DERIVED,
    customDerived
  );

  ui.notifications.info(game.i18n.localize("INTERFACE.Settings.Saved"));
  await this.close();
}

export class InterfaceSettingsApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "interface-settings",
    classes: ["interface", "interface-settings"],
    tag: "form",
    position: {
      width: 680,
      height: 760
    },
    window: {
      title: "INTERFACE.Settings.MenuTitle",
      icon: "fa-solid fa-gears"
    },
    actions: {
      loadDefaults: loadDefaultsAction
    },
    form: {
      closeOnSubmit: false,
      handler: submitSettings
    }
  };

  static PARTS = {
    form: {
      template: "systems/interface/templates/settings/interface-settings.hbs",
      scrollable: [".interface-settings__body"]
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const customDerived = game.settings.get(
      SYSTEM_ID,
      SETTING_KEYS.CUSTOM_DERIVED
    );

    const selectedSkills = new Set(customDerived.skills ?? []);
    const selectedTalents = new Set(customDerived.talents ?? []);

    return {
      ...context,
      settings: {
        [SETTING_KEYS.STATE_PENALTY_COEFFICIENT]: game.settings.get(
          SYSTEM_ID,
          SETTING_KEYS.STATE_PENALTY_COEFFICIENT
        ),
        [SETTING_KEYS.DESTINY_GAIN]: game.settings.get(
          SYSTEM_ID,
          SETTING_KEYS.DESTINY_GAIN
        ),
        [SETTING_KEYS.DESTINY_CAP]: game.settings.get(
          SYSTEM_ID,
          SETTING_KEYS.DESTINY_CAP
        ),
        [SETTING_KEYS.DESTINY_TRIGGER_CHANCE]: game.settings.get(
          SYSTEM_ID,
          SETTING_KEYS.DESTINY_TRIGGER_CHANCE
        ),
        [SETTING_KEYS.DESTINY_CRITICAL_MINIMUM]: game.settings.get(
          SYSTEM_ID,
          SETTING_KEYS.DESTINY_CRITICAL_MINIMUM
        )
      },
      defaults: DEFAULT_SETTINGS,
      customDerived,
      skills: SKILLS.map(skill => ({
        ...skill,
        checked: selectedSkills.has(skill.key)
      })),
      talents: TALENTS.map(talent => ({
        ...talent,
        checked: selectedTalents.has(talent.key)
      }))
    };
  }
}
