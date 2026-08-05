import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(currentFile), "../..");

class FakeField {
  constructor(options = {}) {
    this.options = options;
  }
}

class FakeSchemaField extends FakeField {
  constructor(schema, options = {}) {
    super(options);
    this.schema = schema;
  }
}

class FakeTypeDataModel {
  prepareDerivedData() {}
}

class FakeApplicationV2 {
  async close() {}
  async render() {}
  async submit() {}
  async _postRender() {}
}

class FakeActorSheetV2 extends FakeApplicationV2 {}
class FakeItemSheetV2 extends FakeApplicationV2 {}

function HandlebarsApplicationMixin(Base) {
  return class HandlebarsApplication extends Base {};
}

class FakeDialogV2 {
  static async wait(config) {
    return config.buttons?.[0]?.callback?.() ?? null;
  }

  static async input() {
    return {
      mode: "normal",
      modifier: 0
    };
  }
}

const registeredSettings = [];
const registeredMenus = [];
const registeredSheets = [];
const settingValues = new Map();
const hooks = new Map();
const fakeRollResults = [];
const publishedRolls = [];

globalThis.Roll = class FakeRoll {
  constructor(formula) {
    this.formula = formula;
    this.dice = [];
    this.total = null;
  }

  async evaluate() {
    const values = fakeRollResults.shift();
    if (!values) throw new Error(`Aucun résultat simulé pour ${this.formula}.`);
    this.dice = [{
      results: values.map(result => ({ result, active: true }))
    }];
    this.total = values.reduce((sum, value) => sum + value, 0);
    return this;
  }

  async toMessage(data) {
    publishedRolls.push({ roll: this, data });
    return { id: `message-${publishedRolls.length}` };
  }
};

globalThis.Actor = class Actor {
  constructor() {
    this.name = "Actor de test";
    this.system = {};
    this.updates = [];
  }

  getRollData() {
    return { base: true };
  }

  canUserModify() {
    return true;
  }

  async update(changes) {
    this.updates.push(changes);
    if ("system.resources.destiny.value" in changes) {
      this.system.resources.destiny.value =
        changes["system.resources.destiny.value"];
    }
    return this;
  }
};
globalThis.Item = class Item {};

globalThis.foundry = {
  abstract: {
    TypeDataModel: FakeTypeDataModel
  },
  applications: {
    api: {
      ApplicationV2: FakeApplicationV2,
      DialogV2: FakeDialogV2,
      HandlebarsApplicationMixin
    },
    sheets: {
      ActorSheetV2: FakeActorSheetV2,
      ItemSheetV2: FakeItemSheetV2
    },
    apps: {
      DocumentSheetConfig: {
        registerSheet(...args) {
          registeredSheets.push(args);
        }
      }
    }
  },
  data: {
    fields: {
      NumberField: FakeField,
      StringField: FakeField,
      HTMLField: FakeField,
      BooleanField: FakeField,
      ObjectField: FakeField,
      SchemaField: FakeSchemaField
    }
  },
  documents: {
    Actor: globalThis.Actor,
    Item: globalThis.Item,
    ChatMessage: {
      getSpeaker({ actor }) {
        return { actor: actor?.id ?? "actor-test" };
      }
    }
  }
};

globalThis.CONFIG = {
  Actor: {
    documentClass: globalThis.Actor,
    dataModels: {}
  },
  Item: {
    documentClass: globalThis.Item,
    dataModels: {}
  }
};

globalThis.game = {
  user: {
    id: "user-test",
    isGM: true
  },
  i18n: {
    localize(key) {
      return key;
    },
    format(key, data = {}) {
      return Object.entries(data).reduce(
        (value, [name, replacement]) =>
          value.replaceAll(`{${name}}`, String(replacement)),
        key
      );
    }
  },
  settings: {
    register(system, key, config) {
      registeredSettings.push([system, key, config]);
      settingValues.set(`${system}.${key}`, config.default);
    },
    registerMenu(...args) {
      registeredMenus.push(args);
    },
    get(system, key) {
      return settingValues.get(`${system}.${key}`);
    },
    async set(system, key, value) {
      settingValues.set(`${system}.${key}`, value);
      return value;
    }
  }
};

globalThis.ui = {
  notifications: {
    warn() {},
    error() {},
    info() {}
  }
};

globalThis.Hooks = {
  once(name, callback) {
    hooks.set(name, callback);
  }
};

const entry = pathToFileURL(path.join(root, "scripts/interface.mjs")).href;
await import(`${entry}?smoke=${Date.now()}`);

assert.equal(hooks.has("init"), true, "Le hook init doit être enregistré.");
hooks.get("init")();

assert.notEqual(CONFIG.Actor.documentClass, globalThis.Actor);
assert.notEqual(CONFIG.Item.documentClass, globalThis.Item);
assert.equal(typeof CONFIG.Actor.dataModels.character?.defineSchema, "function");
assert.equal(typeof CONFIG.Item.dataModels.equipment?.defineSchema, "function");
assert.equal(registeredSettings.length, 7);
assert.equal(registeredMenus.length, 1);
assert.equal(registeredSheets.length, 2);

const characterSheetModule = await import(
  `${pathToFileURL(path.join(root, "scripts/applications/character-sheet.mjs")).href}?smoke=${Date.now()}`
);
const equipmentSheetModule = await import(
  `${pathToFileURL(path.join(root, "scripts/applications/equipment-sheet.mjs")).href}?smoke=${Date.now()}`
);

assert.equal(
  characterSheetModule.InterfaceCharacterSheet.DEFAULT_OPTIONS.form.submitOnChange,
  true
);
assert.equal(
  equipmentSheetModule.InterfaceEquipmentSheet.DEFAULT_OPTIONS.form.submitOnChange,
  true
);

const details = new EventTarget();
details.dataset = { section: "notes" };
details.open = true;
const sheet = new characterSheetModule.InterfaceCharacterSheet();
sheet.element = {
  querySelectorAll(selector) {
    assert.equal(selector, "details[data-section]");
    return [details];
  }
};
await sheet._postRender({}, {});
details.dispatchEvent(new Event("toggle"));
assert.equal(sheet.sectionState.notes, true);

const statePenaltySetting = registeredSettings.find(
  ([, key]) => key === "statePenaltyCoefficient"
)?.[2];
const customDerivedSetting = registeredSettings.find(
  ([, key]) => key === "customDerived"
)?.[2];

assert.equal(typeof statePenaltySetting?.onChange, "function");
assert.equal(typeof customDerivedSetting?.onChange, "function");

let preparedActors = 0;
let renderedActors = 0;
game.actors = [{
  prepareData() {
    preparedActors += 1;
  },
  render(force) {
    assert.equal(force, false);
    renderedActors += 1;
  }
}];

statePenaltySetting.onChange(4);
assert.equal(preparedActors, 1);
assert.equal(renderedActors, 1);

const characterSchema = CONFIG.Actor.dataModels.character.defineSchema();
const equipmentSchema = CONFIG.Item.dataModels.equipment.defineSchema();

assert.ok(characterSchema.identity);
assert.ok(characterSchema.skills);
assert.ok(characterSchema.talents);
assert.ok(characterSchema.resources);
assert.ok(characterSchema.progression);
assert.ok(characterSchema.derived);
assert.equal(characterSchema.derived.options.persisted, false);
assert.ok(equipmentSchema.description);
assert.ok(equipmentSchema.category);
assert.ok(equipmentSchema.quantity);
assert.ok(equipmentSchema.damage);

const characterData = Object.create(
  CONFIG.Actor.dataModels.character.prototype
);
characterData.skills = {
  carrure: 40,
  agilite: 30,
  perception: 50,
  mental: 30,
  intellect: 20,
  charisme: 40
};
characterData.talents = {
  endurance: 10,
  forceBrute: 10,
  robustesse: 10,
  agiliteCorporelle: 10,
  precision: 10,
  reflexe: 10,
  acuiteSensorielle: 5,
  sixiemeSens: 5,
  vigilance: 5,
  decision: 5,
  determination: 5,
  equilibreMental: 5,
  creativite: 0,
  erudition: 0,
  logique: 0,
  aura: 0,
  communicationExpressive: 0,
  persuasion: 0
};
characterData.resources = {
  wounds: { value: 4 },
  stress: { value: 7 },
  destiny: { value: 0 }
};
characterData.prepareDerivedData();

assert.equal(characterData.derived.levels.wounds, 2);
assert.equal(characterData.derived.levels.stress, 3);
assert.equal(characterData.derived.statePenalty, 15);
assert.equal(characterData.derived.scores.melee, 45);
assert.equal(characterData.derived.scores.distance, 45);
assert.equal(characterData.derived.initiativeBonus, 5);

const actor = new CONFIG.Actor.documentClass();
actor.system = {
  derived: {
    initiativeBonus: 5
  }
};
assert.deepEqual(actor.getRollData(), {
  base: true,
  derived: {
    initiativeBonus: 5
  }
});

const rollingActor = new CONFIG.Actor.documentClass();
rollingActor.id = "rolling-actor";
rollingActor.name = "Camille";
rollingActor.system = {
  skills: {
    carrure: 40,
    agilite: 30,
    perception: 50,
    mental: 30,
    intellect: 20,
    charisme: 40
  },
  talents: {
    endurance: 10,
    forceBrute: 10,
    robustesse: 10,
    agiliteCorporelle: 10,
    precision: 10,
    reflexe: 10,
    acuiteSensorielle: 5,
    sixiemeSens: 5,
    vigilance: 5,
    decision: 5,
    determination: 5,
    equilibreMental: 5,
    creativite: 0,
    erudition: 0,
    logique: 0,
    aura: 0,
    communicationExpressive: 0,
    persuasion: 0
  },
  resources: {
    wounds: { value: 0 },
    stress: { value: 0 },
    destiny: { value: 10 }
  },
  derived: {
    levels: { wounds: 0, stress: 0 },
    statePenalty: 0,
    scores: {
      melee: 45,
      distance: 45,
      verbal: 30,
      custom: null
    },
    initiativeBonus: 5
  }
};

fakeRollResults.push([42]);
const standardResult = await rollingActor.rollStandardD100({
  skillKey: "carrure",
  talentKey: "endurance",
  mode: "normal",
  modifier: 10
});
assert.equal(standardResult.rawResult, 42);
assert.equal(standardResult.threshold.modifier, 10);
assert.equal(standardResult.threshold.final, 60);
assert.equal(standardResult.finalQualification.success, true);
assert.equal(rollingActor.system.resources.destiny.value, 0);
assert.equal(publishedRolls.length, 1);
assert.match(
  publishedRolls[0].data.flavor,
  /INTERFACE\.D100\.FinalResult/
);

fakeRollResults.push([43, 44]);
const advantageResult = await rollingActor.rollDerivedD100({
  key: "melee",
  mode: "advantage"
});
assert.deepEqual(
  advantageResult.naturalResults.map(result => result.value),
  [43, 44]
);
assert.equal(advantageResult.rawResult, 44);
assert.equal(advantageResult.finalQualification.critical, true);
assert.equal(publishedRolls.length, 2);

await game.settings.set("interface", "destinyTriggerChance", 100);
rollingActor.system.resources.destiny.value = 10;
fakeRollResults.push([57], [1]);
const destinyResult = await rollingActor.rollStandardD100({
  skillKey: "carrure",
  talentKey: "endurance",
  mode: "normal"
});
assert.equal(destinyResult.destiny.triggered, true);
assert.equal(destinyResult.destiny.secretRoll, 1);
assert.equal(destinyResult.finalResult, 50);
assert.equal(rollingActor.system.resources.destiny.value, 0);
assert.equal(publishedRolls.length, 3);
assert.doesNotMatch(publishedRolls[2].data.flavor, /secret|chance|éligib/i);

console.log("OK — chargement isolé, enregistrements et jets Foundry simulés.");
