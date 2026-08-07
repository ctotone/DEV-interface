import assert from "node:assert/strict";

globalThis.Roll = class FakeRoll {
  static calls = [];
  static validate(formula) {
    return formula === "2d6+1";
  }

  constructor(formula) {
    this.formula = formula;
    this.total = null;
  }

  async evaluate(options = {}) {
    Roll.calls.push({ formula: this.formula, options: { ...options } });
    this.total = options.maximize ? 13 : 8;
    return this;
  }
};

const {
  CHAT_CARD_TYPES,
  buildD100PublicData,
  buildPenaltyData,
  cardEnvelope,
  resultTone
} = await import("../../scripts/chat/chat-card-data.mjs");
const {
  createWeaponSnapshot,
  snapshotActorWeapons
} = await import("../../scripts/services/weapon-snapshot-service.mjs");
const {
  rollWeaponDamage
} = await import("../../scripts/services/damage-service.mjs");
const {
  latestDamageResultForSelector
} = await import("../../scripts/chat/chat-card-controller.mjs");
const {
  initiativeTieForCombatant
} = await import("../../scripts/services/initiative-service.mjs");
const {
  DEFAULT_INTERFACE_THEME,
  resolveActorTheme
} = await import("../../scripts/services/theme-service.mjs");

assert.equal(resultTone({ success: false }), "failure");
assert.equal(
  resultTone({ success: false, critical: true }),
  "critical-failure"
);
assert.equal(
  resultTone({ success: false, superCritical: true }),
  "super-critical-failure"
);
assert.equal(resultTone({ success: true }), "success");
assert.equal(
  resultTone({ success: true, critical: true }),
  "critical-success"
);
assert.equal(
  resultTone({ success: true, superCritical: true }),
  "super-critical-success"
);

assert.deepEqual(
  buildPenaltyData({
    state: {
      coefficient: 3,
      woundsLevel: 2,
      stressLevel: 1
    },
    threshold: {
      modifier: -4
    }
  }),
  {
    wounds: 6,
    stress: 3,
    roll: 4,
    total: 13
  }
);

const publicData = buildD100PublicData({
  actor: {
    name: "Camille",
    img: "portrait.webp"
  },
  result: {
    source: {
      kind: "standard",
      key: "carrure:endurance",
      label: "Carrure + Endurance",
      displayLabel: "Endurance",
      baseValue: 50
    },
    mode: "advantage",
    state: {
      coefficient: 3,
      woundsLevel: 1,
      stressLevel: 0
    },
    threshold: {
      modifier: -2,
      final: 45
    },
    naturalResults: [{ value: 30 }, { value: 44 }],
    selectedIndex: 1,
    rawResult: 44,
    finalResult: 40,
    finalQualification: {
      success: true,
      automatic: false,
      critical: true,
      superCritical: false,
      quality: "critical-success"
    },
    margin: {
      kind: "success",
      value: 0
    },
    destiny: {
      triggered: true,
      correction: -4,
      secretRoll: 1,
      eligible: true
    },
    context: {
      kind: "general"
    }
  }
});

assert.equal(publicData.source.name, "Endurance");
assert.equal(publicData.threshold, 45);
assert.equal(publicData.penalties.total, 5);
assert.equal(publicData.destinyIntervened, true);
assert.equal(publicData.destinyCorrection, -4);
assert.doesNotMatch(
  JSON.stringify(publicData),
  /secretRoll|eligible|triggerChance|criticalMinimum/
);

const weaponItem = {
  type: "equipment",
  uuid: "Actor.test.Item.weapon",
  name: "Pistolet",
  img: "weapon.webp",
  sort: 20,
  system: {
    category: "weapon",
    damage: {
      formula: "2d6+1"
    }
  }
};
const snapshot = createWeaponSnapshot(weaponItem);
assert.deepEqual(Object.keys(snapshot), [
  "itemUuid",
  "name",
  "img",
  "damageFormula",
  "formulaValidAtCreation",
  "sort"
]);
assert.equal(snapshot.formulaValidAtCreation, true);
weaponItem.name = "Arme renommée";
weaponItem.system.damage.formula = "1";
assert.equal(snapshot.name, "Pistolet");
assert.equal(snapshot.damageFormula, "2d6+1");

const actor = {
  items: [
    {
      ...weaponItem,
      uuid: "Actor.test.Item.second",
      name: "Zeta",
      sort: 50,
      system: {
        category: "weapon",
        damage: { formula: "" }
      }
    },
    {
      ...weaponItem,
      uuid: "Actor.test.Item.first",
      name: "Alpha",
      sort: 10,
      system: {
        category: "weapon",
        damage: { formula: "2d6+1" }
      }
    },
    {
      type: "equipment",
      name: "Sac",
      sort: 0,
      system: {
        category: "ordinary",
        damage: { formula: "" }
      }
    }
  ]
};
const actorSnapshots = snapshotActorWeapons(actor);
assert.equal(actorSnapshots.length, 2);
assert.equal(actorSnapshots[0].name, "Alpha");
assert.equal(actorSnapshots[1].formulaValidAtCreation, false);

const normalDamage = await rollWeaponDamage(snapshot);
assert.equal(normalDamage.total, 8);
assert.equal(normalDamage.maximized, false);
assert.deepEqual(Roll.calls.at(-1).options, {
  allowInteractive: false,
  maximize: false
});

const maximumDamage = await rollWeaponDamage(snapshot, { maximize: true });
assert.equal(maximumDamage.total, 13);
assert.equal(maximumDamage.maximized, true);
assert.deepEqual(Roll.calls.at(-1).options, {
  allowInteractive: false,
  maximize: true
});

function message(id, timestamp, parentMessageId, total) {
  const card = cardEnvelope({
    type: CHAT_CARD_TYPES.DAMAGE_RESULT,
    actorUuid: "Actor.test",
    publicData: {
      parentMessageId,
      total,
      createdAt: timestamp
    }
  });
  return {
    id,
    timestamp,
    getFlag(scope, key) {
      if (scope === "interface" && key === "card") return card;
      return null;
    }
  };
}

const latest = latestDamageResultForSelector([
  message("a", 10, "selector", 4),
  message("b", 20, "selector", 9),
  message("c", 30, "other-selector", 12)
], "selector");
assert.equal(latest.total, 9);

const combatants = [
  { name: "Alice", initiative: 7 },
  { name: "Bruno", initiative: 7 },
  { name: "Chloé", initiative: 5 }
];
const tie = initiativeTieForCombatant(
  { combatants: { contents: combatants } },
  combatants[0]
);
assert.deepEqual(tie, {
  initiative: 7,
  names: ["Alice", "Bruno"]
});
assert.equal(
  initiativeTieForCombatant(
    { combatants: { contents: combatants } },
    combatants[2]
  ),
  null
);

assert.equal(DEFAULT_INTERFACE_THEME, "default");
assert.equal(resolveActorTheme({}), "default");

console.log("OK — Phase 05 : projections, snapshots, dégâts, initiative et thème.");
