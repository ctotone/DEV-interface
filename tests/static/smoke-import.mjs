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
  constructor() {
    this.renderCalls = 0;
    this.closeCalls = 0;
  }

  async close() {
    this.closeCalls += 1;
    return this;
  }

  async render() {
    this.renderCalls += 1;
    return this;
  }

  bringToFront() {
    this.broughtToFront = true;
    return this;
  }

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
    const button = config.buttons?.[0];
    return button?.callback ? button.callback() : button?.action ?? null;
  }

  static async input() {
    return {
      mode: "normal",
      modifier: 0
    };
  }
}

class FakeFilePicker extends FakeApplicationV2 {
  constructor(options = {}) {
    super();
    this.options = options;
  }
}

const registeredSettings = [];
const registeredMenus = [];
const registeredSheets = [];
const settingValues = new Map();
const hooks = new Map();
const fakeRollResults = [];
const publishedRolls = [];
const publishedMessages = [];

function getByPath(target, path) {
  return String(path).split(".").reduce(
    (value, key) => value?.[key],
    target
  );
}

function setByPath(target, path, value) {
  const parts = String(path).split(".");
  let current = target;
  for (const key of parts.slice(0, -1)) {
    current[key] ??= {};
    current = current[key];
  }
  current[parts.at(-1)] = value;
}

function deleteByPath(target, path) {
  const parts = String(path).split(".");
  let current = target;
  for (const key of parts.slice(0, -1)) {
    current = current?.[key];
    if (!current) return;
  }
  delete current[parts.at(-1)];
}


globalThis.Roll = class FakeRoll {
  static validate(formula) {
    return typeof formula === "string" && formula.trim().length > 0;
  }

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
  static created = [];

  static canUserCreate() {
    return true;
  }

  static defaultName() {
    return "Nouveau personnage";
  }

  static getDefaultArtwork() {
    return {
      img: "icons/svg/mystery-man.svg",
      texture: { src: "icons/svg/mystery-man.svg" }
    };
  }

  static async create(data) {
    const actor = new this(data);
    this.created.push(actor);
    return actor;
  }

  static async createDialog() {
    return null;
  }

  constructor(data = {}) {
    this.id = data._id ?? `actor-${globalThis.Actor.created.length + 1}`;
    this.uuid = `Actor.${this.id}`;
    this.name = data.name ?? "Actor de test";
    this.type = data.type ?? "character";
    this.img = data.img ?? "icons/svg/mystery-man.svg";
    this.system = structuredClone(data.system ?? {});
    this.flags = structuredClone(data.flags ?? {});
    this.items = Array.from(data.items ?? []);
    this.updates = [];
  }

  getRollData() {
    return { base: true };
  }

  canUserModify() {
    return true;
  }

  getFlag(scope, key) {
    return getByPath(this.flags?.[scope], key);
  }

  async setFlag(scope, key, value) {
    this.flags[scope] ??= {};
    setByPath(this.flags[scope], key, value);
    return this;
  }

  async unsetFlag(scope, key) {
    deleteByPath(this.flags?.[scope], key);
    return this;
  }

  async update(changes) {
    this.updates.push(changes);
    for (const [path, value] of Object.entries(changes)) {
      setByPath(this, path, value);
    }
    return this;
  }
};
globalThis.Item = class Item {};

class FakeChatMessage {
  static getSpeaker({ actor }) {
    return { actor: actor?.id ?? "actor-test" };
  }

  static async create(data) {
    const message = new FakeChatMessage(data);
    publishedMessages.push(message);
    game.messages.contents.push(message);
    return message;
  }

  constructor(data = {}) {
    this.id = `message-${publishedMessages.length + 1}`;
    this.timestamp = Date.now() + publishedMessages.length;
    this.user = data.user;
    this.speaker = data.speaker;
    this.content = data.content ?? "";
    this.flags = structuredClone(data.flags ?? {});
    this.whisper = Array.from(data.whisper ?? []);
  }

  getFlag(scope, key) {
    return getByPath(this.flags?.[scope], key);
  }
}

globalThis.foundry = {
  abstract: {
    TypeDataModel: FakeTypeDataModel
  },
  applications: {
    handlebars: {
      async renderTemplate(path, data = {}) {
        return `<article data-interface-card data-template="${path}">${
          data.actorName ?? ""
        }</article>`;
      }
    },
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
      },
      FilePicker: FakeFilePicker
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
    ChatMessage: FakeChatMessage
  },
  utils: {
    fromUuidSync() {
      return null;
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
  users: [
    { id: "user-test", isGM: true }
  ],
  messages: {
    contents: [],
    get(id) {
      return this.contents.find(message => message.id === id);
    },
    [Symbol.iterator]() {
      return this.contents[Symbol.iterator]();
    }
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
  },
  on(name, callback) {
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
const characterCreationModule = await import(
  `${pathToFileURL(path.join(root, "scripts/applications/character-creation-application.mjs")).href}?smoke=${Date.now()}`
);

assert.equal(
  characterSheetModule.InterfaceCharacterSheet.DEFAULT_OPTIONS.form.submitOnChange,
  true
);
assert.equal(
  equipmentSheetModule.InterfaceEquipmentSheet.DEFAULT_OPTIONS.form.submitOnChange,
  true
);
assert.equal(
  characterCreationModule.InterfaceCharacterCreationApplication.DEFAULT_OPTIONS
    .form.closeOnSubmit,
  false
);

const createdEquipmentData = [];
const equipmentTestSheet = new characterSheetModule.InterfaceCharacterSheet();
equipmentTestSheet.actor = {
  canUserModify() {
    return true;
  },
  async createEmbeddedDocuments(type, documents) {
    assert.equal(type, "Item");
    createdEquipmentData.push(...documents);
    return documents.map((document, index) => ({
      ...document,
      id: `equipment-${index + 1}`,
      sheet: {
        async render() {}
      }
    }));
  }
};
const fakeEquipmentEvent = {
  preventDefault() {},
  stopPropagation() {}
};
await characterSheetModule.InterfaceCharacterSheet.DEFAULT_OPTIONS.actions
  .createEquipment.call(
    equipmentTestSheet,
    fakeEquipmentEvent,
    { dataset: { category: "ordinary" } }
  );
await characterSheetModule.InterfaceCharacterSheet.DEFAULT_OPTIONS.actions
  .createEquipment.call(
    equipmentTestSheet,
    fakeEquipmentEvent,
    { dataset: { category: "weapon" } }
  );
assert.equal(
  createdEquipmentData[0].img,
  "systems/interface/assets/items/item_default.webp"
);
assert.equal(
  createdEquipmentData[1].img,
  "systems/interface/assets/items/weapon_default.webp"
);
assert.equal(
  CONFIG.Actor.documentClass.createDialog
    !== globalThis.Actor.createDialog,
  true
);

const pendingActor = await CONFIG.Actor.documentClass.createDialog({
  name: "Personnage en attente",
  type: "character"
});
assert.ok(pendingActor);
assert.equal(
  pendingActor.getFlag("interface", "creation.pending"),
  true
);
assert.equal(
  pendingActor.img,
  "systems/interface/assets/actor/avatar-default.webp",
  "Un nouvel Actor doit recevoir le portrait par défaut du système."
);

const pendingCreationApplication =
  await characterCreationModule.InterfaceCharacterCreationApplication
    .openForActor({ actor: pendingActor });
assert.ok(pendingCreationApplication);
const samePendingCreationApplication =
  await characterCreationModule.InterfaceCharacterCreationApplication
    .openForActor({ actor: pendingActor });
assert.equal(samePendingCreationApplication, pendingCreationApplication);
assert.equal(pendingCreationApplication.broughtToFront, true);

const draftValues = {
  name: "Ariane",
  age: "31",
  profession: "Archiviste",
  specializations: "Occultisme"
};
for (const skill of [
  "carrure",
  "agilite",
  "perception",
  "mental",
  "intellect",
  "charisme"
]) {
  draftValues[`skills.${skill}`] = "30";
}
for (const talent of [
  "endurance",
  "forceBrute",
  "robustesse",
  "agiliteCorporelle",
  "precision",
  "reflexe",
  "acuiteSensorielle",
  "sixiemeSens",
  "vigilance",
  "decision",
  "determination",
  "equilibreMental",
  "creativite",
  "erudition",
  "logique",
  "aura",
  "communicationExpressive",
  "persuasion"
]) {
  draftValues[`talents.${talent}`] = "5";
}
pendingCreationApplication.form = {
  elements: {
    namedItem(name) {
      return { value: draftValues[name] ?? "" };
    }
  }
};
assert.equal(await pendingCreationApplication.saveDraft(), true);
assert.equal(pendingActor.name, "Ariane");
assert.equal(pendingActor.system.identity.age, "31");
assert.equal(pendingActor.system.skills.carrure, 30);
assert.equal(pendingActor.system.talents.endurance, 5);
assert.equal(
  pendingActor.getFlag("interface", "creation.pending"),
  true
);
assert.equal(
  pendingActor.img,
  "systems/interface/assets/actor/avatar-default.webp",
  "Un nouvel Actor doit recevoir le portrait par défaut du système."
);

await pendingCreationApplication.close();
assert.equal(
  pendingActor.getFlag("interface", "creation.pending"),
  true,
  "Fermer l’assistant doit conserver l’état de création en attente."
);
const reopenedPendingCreationApplication =
  await characterCreationModule.InterfaceCharacterCreationApplication
    .openForActor({ actor: pendingActor });
assert.notEqual(
  reopenedPendingCreationApplication,
  pendingCreationApplication,
  "Une nouvelle instance doit pouvoir rouvrir la création en attente."
);

const pendingSheet = new characterSheetModule.InterfaceCharacterSheet();
pendingSheet.actor = pendingActor;
await pendingSheet.render({ force: true });
assert.equal(
  pendingSheet.renderCalls,
  0,
  "La fiche classique ne doit pas être rendue tant que la création est en attente."
);

const finalValues = {
  ...draftValues,
  name: "Ariane finalisée",
  "skills.carrure": "20",
  "skills.agilite": "30",
  "skills.perception": "30",
  "skills.mental": "40",
  "skills.intellect": "40",
  "skills.charisme": "50"
};
const talentNames = [
  "endurance",
  "forceBrute",
  "robustesse",
  "agiliteCorporelle",
  "precision",
  "reflexe",
  "acuiteSensorielle",
  "sixiemeSens",
  "vigilance",
  "decision",
  "determination",
  "equilibreMental",
  "creativite",
  "erudition",
  "logique",
  "aura",
  "communicationExpressive",
  "persuasion"
];
for (const [index, talent] of talentNames.entries()) {
  finalValues[`talents.${talent}`] = index < 10 ? "10" : "0";
}
const finalButton = { disabled: false, isConnected: true };
const finalForm = {
  elements: {
    namedItem(name) {
      return {
        value: finalValues[name] ?? "",
        focus() {}
      };
    }
  },
  querySelector(selector) {
    assert.equal(selector, 'button[type="submit"]');
    return finalButton;
  }
};
reopenedPendingCreationApplication.form = finalForm;
await characterCreationModule.InterfaceCharacterCreationApplication
  .DEFAULT_OPTIONS.form.handler.call(
    reopenedPendingCreationApplication,
    new Event("submit"),
    finalForm
  );
assert.equal(
  pendingActor.getFlag("interface", "creation.pending"),
  undefined,
  "La validation finale doit retirer le flag de création."
);
assert.equal(pendingActor.name, "Ariane finalisée");
assert.equal(globalThis.Actor.created.length, 1);

await pendingSheet.render({ force: true });
assert.equal(
  pendingSheet.renderCalls,
  1,
  "La fiche classique doit être rendue après retrait du flag de création."
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
assert.equal(publishedMessages.length, 1);
assert.equal(
  publishedMessages[0].getFlag("interface", "card").type,
  "d100-result"
);
assert.equal(
  publishedMessages[0].getFlag("interface", "card").schema,
  1
);
assert.equal(
  publishedMessages[0].getFlag("interface", "card").publicData.source.name,
  "INTERFACE.Talent.Endurance"
);
assert.equal(
  publishedMessages[0].getFlag("interface", "card").publicData.threshold,
  60
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
assert.equal(publishedMessages.length, 3);
assert.equal(
  publishedMessages[2].getFlag("interface", "card").type,
  "weapon-selector"
);

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
assert.equal(publishedMessages.length, 5);
const publicDestinyCard = publishedMessages[3].getFlag("interface", "card");
const gmDestinyCard = publishedMessages[4].getFlag("interface", "card");
assert.equal(publicDestinyCard.type, "d100-result");
assert.equal(gmDestinyCard.type, "d100-gm-detail");
assert.doesNotMatch(
  JSON.stringify(publicDestinyCard.publicData),
  /secretRoll|triggerChance|eligible|criticalMinimum/
);
assert.equal(gmDestinyCard.gmData.destiny.secretRoll, 1);
assert.deepEqual(publishedMessages[4].whisper, ["user-test"]);

console.log("OK — chargement isolé, enregistrements et jets Foundry simulés.");
