import assert from "node:assert/strict";
import { qualifyNatural } from "../../scripts/rules/d100/qualify-natural.mjs";
import { selectRawResult } from "../../scripts/rules/d100/select-raw.mjs";
import { D100_MODES } from "../../scripts/rules/d100/constants.mjs";
import { resolveD100 } from "../../scripts/rules/d100/resolve-d100.mjs";

function input({
  threshold = 50,
  base = threshold,
  values = [42],
  mode = D100_MODES.NORMAL,
  destinyBefore = 0,
  gain = 5,
  cap = 30,
  chance = 80,
  criticalMinimum = 15,
  modifier = 0
} = {}) {
  return {
    schema: 1,
    source: {
      kind: "standard",
      key: "carrure:endurance",
      label: "Carrure + Endurance",
      baseValue: base,
      skillKey: "carrure",
      talentKey: "endurance"
    },
    mode,
    state: {
      woundsValue: 0,
      woundsLevel: 0,
      stressValue: 0,
      stressLevel: 0,
      coefficient: 3,
      penalty: base - threshold
    },
    threshold: {
      base,
      modifier,
      final: threshold
    },
    destiny: {
      before: destinyBefore,
      gain,
      cap,
      triggerChance: chance,
      criticalMinimum
    },
    naturalValues: values,
    context: {
      kind: "general"
    }
  };
}

function resolve(options, secretRoll = null) {
  return resolveD100(input(options), { secretRoll });
}

// T01 — Réussite ordinaire
{
  const result = resolve({ threshold: 50, values: [42], destinyBefore: 10 });
  assert.equal(result.finalQualification.success, true);
  assert.equal(result.finalQualification.critical, false);
  assert.equal(result.finalResult, 42);
  assert.equal(result.margin.value, 0);
  assert.equal(result.destiny.after, 0);
}

// T02 — Réussite critique
{
  const result = resolve({ threshold: 50, values: [44], destinyBefore: 20 });
  assert.equal(result.finalQualification.success, true);
  assert.equal(result.finalQualification.critical, true);
  assert.equal(result.finalResult, 44);
  assert.equal(result.destiny.after, 0);
}

// T03 — Super réussite critique
{
  const result = resolve({ threshold: 0, values: [1] });
  assert.equal(result.finalQualification.success, true);
  assert.equal(result.finalQualification.automatic, true);
  assert.equal(result.finalQualification.superCritical, true);
  assert.equal(result.finalResult, 1);
}

// T04 — Échec automatique
{
  const result = resolve({ threshold: 100, values: [96], destinyBefore: 25 });
  assert.equal(result.finalQualification.success, false);
  assert.equal(result.finalQualification.automatic, true);
  assert.equal(result.finalQualification.critical, false);
  assert.equal(result.destiny.tested, false);
  assert.equal(result.finalResult, 96);
  assert.equal(result.destiny.after, 30);
}

// T05 — Échec automatique critique
{
  const result = resolve({ threshold: 100, values: [99], destinyBefore: 15 });
  assert.equal(result.finalQualification.automatic, true);
  assert.equal(result.finalQualification.critical, true);
  assert.equal(result.finalResult, 99);
  assert.equal(result.destiny.after, 20);
}

// T06 — Super échec critique
{
  const result = resolve({ threshold: 100, values: [100], destinyBefore: 30 });
  assert.equal(result.finalQualification.superCritical, true);
  assert.equal(result.finalQualification.automatic, true);
  assert.equal(result.finalResult, 100);
  assert.equal(result.destiny.after, 30);
}

// T07 — Avantage choisissant une réussite critique
{
  const result = resolve({
    threshold: 50,
    values: [43, 44],
    mode: D100_MODES.ADVANTAGE
  });
  assert.equal(result.selectedIndex, 1);
  assert.equal(result.rawResult, 44);
  assert.equal(result.finalQualification.critical, true);
}

// T08 — Désavantage choisissant un échec critique
{
  const result = resolve({
    threshold: 50,
    values: [55, 56],
    mode: D100_MODES.DISADVANTAGE
  });
  assert.equal(result.selectedIndex, 0);
  assert.equal(result.rawResult, 55);
  assert.equal(result.finalQualification.critical, true);
  assert.equal(result.finalQualification.success, false);
}

// T09 — Avantage avec même qualité
{
  const result = resolve({
    threshold: 50,
    values: [31, 42],
    mode: D100_MODES.ADVANTAGE
  });
  assert.equal(result.rawResult, 31);
}

// T10 — Désavantage avec même qualité
{
  const result = resolve({
    threshold: 50,
    values: [63, 78],
    mode: D100_MODES.DISADVANTAGE
  });
  assert.equal(result.rawResult, 78);
}

// T11 — Destin insuffisant
{
  const result = resolve({
    threshold: 50,
    values: [62],
    destinyBefore: 10
  });
  assert.equal(result.destiny.correctionNeeded, 12);
  assert.equal(result.destiny.tested, false);
  assert.equal(result.finalResult, 62);
  assert.equal(result.destiny.after, 15);
}

// T12 — Destin suffisant mais non déclenché
{
  const result = resolve({
    threshold: 50,
    values: [57],
    destinyBefore: 10
  }, 81);
  assert.equal(result.destiny.tested, true);
  assert.equal(result.destiny.triggered, false);
  assert.equal(result.finalResult, 57);
  assert.equal(result.destiny.after, 15);
}

// T13 — Destin suffisant et déclenché
{
  const result = resolve({
    threshold: 50,
    values: [57],
    destinyBefore: 10
  }, 80);
  assert.equal(result.destiny.triggered, true);
  assert.equal(result.finalResult, 50);
  assert.equal(result.finalQualification.success, true);
  assert.equal(result.finalQualification.critical, false);
  assert.equal(result.margin.value, 0);
  assert.equal(result.destiny.after, 0);
}

// T14 — Destin avec seuil double
{
  const result = resolve({
    threshold: 44,
    values: [51],
    destinyBefore: 15
  }, 1);
  assert.equal(result.finalResult, 43);
  assert.equal(result.finalQualification.success, true);
  assert.equal(result.finalQualification.critical, false);
  assert.equal(result.destiny.after, 0);
}

// T15 — Seuil inférieur ou égal à 5
{
  const result = resolve({
    threshold: 4,
    values: [7],
    destinyBefore: 30
  });
  assert.equal(result.destiny.tested, false);
  assert.equal(result.finalResult, 7);
  assert.equal(result.finalQualification.success, false);
  assert.equal(result.destiny.after, 30);
}

// T16 — Critique avec réserve insuffisante
{
  const result = resolve({
    threshold: 40,
    values: [55],
    destinyBefore: 10
  });
  assert.equal(result.destiny.tested, false);
  assert.equal(result.finalQualification.critical, true);
  assert.equal(result.destiny.after, 15);
}

// T17 — Critique amorti par le Destin
{
  const result = resolve({
    threshold: 40,
    values: [55],
    destinyBefore: 15
  }, 1);
  assert.equal(result.finalResult, 54);
  assert.equal(result.finalQualification.success, false);
  assert.equal(result.finalQualification.critical, false);
  assert.equal(result.destiny.after, 0);
}

// T18 — Critique proche du seuil
{
  const result = resolve({
    threshold: 54,
    values: [55],
    destinyBefore: 15
  }, 1);
  assert.equal(result.finalResult, 56);
  assert.equal(result.finalQualification.success, false);
  assert.equal(result.finalQualification.critical, false);
  assert.equal(result.destiny.after, 0);
}

// T19 — Critique non amorti
{
  const result = resolve({
    threshold: 40,
    values: [55],
    destinyBefore: 20
  }, 81);
  assert.equal(result.finalResult, 55);
  assert.equal(result.finalQualification.critical, true);
  assert.equal(result.destiny.after, 25);
}

// T20 — Marge après intervention du Destin
{
  const result = resolve({
    threshold: 60,
    values: [67],
    destinyBefore: 10
  }, 1);
  assert.equal(result.finalResult, 60);
  assert.equal(result.finalQualification.success, true);
  assert.equal(result.margin.value, 0);
}

// Bornes et priorité des automatiques
for (const value of [1, 2, 5, 6, 95, 96, 98, 99, 100]) {
  const result = qualifyNatural(value, 50);
  assert.equal(result.value, value);
}
assert.equal(qualifyNatural(5, -20).success, true);
assert.equal(qualifyNatural(96, 150).success, false);
assert.equal(qualifyNatural(22, 30).critical, true);
assert.equal(qualifyNatural(22, 20).critical, true);
assert.equal(qualifyNatural(22, 20).success, false);

// Seuils inhabituels sans clamp
assert.equal(resolve({ threshold: -10, values: [2] }).finalQualification.success, true);
assert.equal(resolve({ threshold: -10, values: [6] }).finalQualification.success, false);
assert.equal(resolve({ threshold: 150, values: [95] }).finalQualification.success, true);
assert.equal(resolve({ threshold: 150, values: [96] }).finalQualification.success, false);

// Chance 0 et 100
assert.equal(resolve({
  threshold: 50,
  values: [57],
  destinyBefore: 10,
  chance: 0
}, 1).destiny.triggered, false);
assert.equal(resolve({
  threshold: 50,
  values: [57],
  destinyBefore: 10,
  chance: 100
}, 100).destiny.triggered, true);

// Gain et plafond
assert.equal(resolve({
  threshold: 50,
  values: [70],
  destinyBefore: 10,
  gain: 0
}).destiny.after, 10);
assert.equal(resolve({
  threshold: 50,
  values: [70],
  destinyBefore: 30,
  cap: 30
}, 100).destiny.after, 30);
assert.equal(resolve({
  threshold: 50,
  values: [70],
  destinyBefore: 10,
  cap: 0
}).destiny.after, 0);

// Minimum critique configurable
assert.equal(resolve({
  threshold: 40,
  values: [55],
  destinyBefore: 0,
  criticalMinimum: 0
}, 1).destiny.triggered, true);

// Départage et dé écarté
{
  const results = [
    qualifyNatural(44, 50),
    qualifyNatural(1, 50)
  ];
  assert.equal(
    selectRawResult(results, D100_MODES.ADVANTAGE).selected.value,
    1
  );
  assert.equal(
    selectRawResult(results, D100_MODES.DISADVANTAGE).selected.value,
    44
  );
}

// Marges exactes
assert.equal(resolve({ threshold: 60, values: [51] }).margin.value, 0);
assert.equal(resolve({ threshold: 60, values: [50] }).margin.value, 1);
assert.equal(resolve({ threshold: 60, values: [39] }).margin.value, 2);
assert.equal(resolve({ threshold: 60, values: [61] }).margin.value, 0);
assert.equal(resolve({ threshold: 60, values: [70] }).margin.value, 1);
assert.equal(resolve({ threshold: 60, values: [84] }).margin.value, 2);

// Invariance et immutabilité
{
  const original = input({
    threshold: 50,
    values: [57],
    destinyBefore: 10
  });
  const before = structuredClone(original);
  const result = resolveD100(original, { secretRoll: 1 });
  assert.deepEqual(original, before);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.destiny), true);
}

// Bonus/malus situationnel transmis dans le seuil final
{
  const result = resolve({
    base: 60,
    threshold: 70,
    modifier: 10,
    values: [65]
  });
  assert.equal(result.threshold.base, 60);
  assert.equal(result.threshold.modifier, 10);
  assert.equal(result.threshold.final, 70);
  assert.equal(result.finalQualification.success, true);
}

{
  const result = resolve({
    base: 60,
    threshold: 50,
    modifier: -10,
    values: [55]
  });
  assert.equal(result.threshold.modifier, -10);
  assert.equal(result.threshold.final, 50);
  assert.equal(result.finalQualification.success, false);
}

console.log("OK — moteur D100 : T01 à T20 et cas complémentaires réussis.");
