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
  async _postRender() {}
}

class FakeActorSheetV2 extends FakeApplicationV2 {}
class FakeItemSheetV2 extends FakeApplicationV2 {}

function HandlebarsApplicationMixin(Base) {
  return class HandlebarsApplication extends Base {};
}

const registeredSettings = [];
const registeredMenus = [];
const registeredSheets = [];
const settingValues = new Map();
const hooks = new Map();

globalThis.Actor = class Actor {
  getRollData() {
    return { base: true };
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
    Item: globalThis.Item
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
    }
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

console.log("OK — chargement isolé du point d’entrée et enregistrements simulés.");
