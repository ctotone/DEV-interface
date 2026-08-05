import assert from "node:assert/strict";
import {
  buildCharacterDerivedData,
  calculateCreationDiagnostics,
  calculateCustomDerivedScore,
  calculateDerivedScore,
  calculateFixedDerivedScores,
  calculateInitiativeBonus,
  calculateStateLevel,
  calculateStatePenalty,
  validateCustomDerivedConfiguration
} from "../../scripts/rules/derived-values.mjs";
import { SKILLS, TALENTS } from "../../scripts/constants.mjs";

function values(entries, initial = 0) {
  return Object.fromEntries(entries.map(entry => [entry.key, initial]));
}

const skills = values(SKILLS);
const talents = values(TALENTS);

assert.equal(calculateStateLevel(0), 0);
assert.equal(calculateStateLevel(1), 1);
assert.equal(calculateStateLevel(3), 1);
assert.equal(calculateStateLevel(4), 2);
assert.equal(calculateStateLevel(6), 2);
assert.equal(calculateStateLevel(7), 3);
assert.equal(calculateStateLevel(9), 3);
assert.equal(calculateStateLevel(10), 4);
assert.equal(calculateStateLevel(12), 4);
assert.equal(calculateStateLevel(13), 5);
assert.equal(calculateStateLevel(15), 5);

assert.deepEqual(
  calculateStatePenalty({ wounds: 4, stress: 7, coefficient: 3 }),
  {
    levels: { wounds: 2, stress: 3 },
    penalty: 15
  }
);

Object.assign(skills, {
  carrure: 40,
  agilite: 30,
  perception: 50,
  mental: 30,
  intellect: 20,
  charisme: 40
});

for (const key of [
  "endurance",
  "forceBrute",
  "robustesse",
  "agiliteCorporelle",
  "precision",
  "reflexe"
]) talents[key] = 10;

for (const key of [
  "acuiteSensorielle",
  "sixiemeSens",
  "vigilance",
  "decision",
  "determination",
  "equilibreMental"
]) talents[key] = 5;

const fixed = calculateFixedDerivedScores({ skills, talents });
assert.deepEqual(fixed, {
  melee: 45,
  distance: 45,
  verbal: 30
});
assert.equal(calculateInitiativeBonus(fixed.distance), 5);

assert.equal(
  calculateDerivedScore({
    skills: { first: 41, second: 30 },
    talents: {
      a: 10,
      b: 10,
      c: 10,
      d: 10,
      e: 10,
      f: 10
    },
    skillKeys: ["first", "second"],
    talentKeys: ["a", "b", "c", "d", "e", "f"]
  }),
  45,
  "Le calcul doit appliquer floor au total des deux moyennes."
);

assert.equal(
  calculateDerivedScore({
    skills: { first: 100, second: 100 },
    talents: {
      a: 30,
      b: 30,
      c: 30,
      d: 30,
      e: 30,
      f: 30
    },
    skillKeys: ["first", "second"],
    talentKeys: ["a", "b", "c", "d", "e", "f"]
  }),
  99,
  "Une valeur dérivée doit être plafonnée à 99."
);

assert.deepEqual(
  validateCustomDerivedConfiguration({
    enabled: false,
    name: "Conservée",
    skills: ["carrure", "agilite"],
    talents: [
      "endurance",
      "forceBrute",
      "robustesse",
      "agiliteCorporelle",
      "precision",
      "reflexe"
    ]
  }),
  {
    enabled: false,
    valid: false,
    name: "Conservée",
    skills: ["carrure", "agilite"],
    talents: [
      "endurance",
      "forceBrute",
      "robustesse",
      "agiliteCorporelle",
      "precision",
      "reflexe"
    ],
    reason: "disabled"
  }
);

assert.equal(
  validateCustomDerivedConfiguration({
    enabled: true,
    name: "",
    skills: ["carrure", "agilite"],
    talents: [
      "endurance",
      "forceBrute",
      "robustesse",
      "agiliteCorporelle",
      "precision",
      "reflexe"
    ]
  }).valid,
  false
);

assert.equal(
  validateCustomDerivedConfiguration({
    enabled: true,
    name: "Doublon",
    skills: ["carrure", "carrure"],
    talents: [
      "endurance",
      "forceBrute",
      "robustesse",
      "agiliteCorporelle",
      "precision",
      "reflexe"
    ]
  }).valid,
  false
);

assert.equal(
  validateCustomDerivedConfiguration({
    enabled: true,
    name: "Inconnue",
    skills: ["carrure", "inconnue"],
    talents: [
      "endurance",
      "forceBrute",
      "robustesse",
      "agiliteCorporelle",
      "precision",
      "reflexe"
    ]
  }).valid,
  false
);

const customConfiguration = {
  enabled: true,
  name: "Sang-froid",
  skills: ["carrure", "intellect"],
  talents: [
    "endurance",
    "forceBrute",
    "robustesse",
    "creativite",
    "erudition",
    "logique"
  ]
};

assert.equal(
  validateCustomDerivedConfiguration(customConfiguration).valid,
  true
);
assert.equal(
  calculateCustomDerivedScore({
    skills,
    talents,
    configuration: customConfiguration
  }),
  35
);
assert.equal(
  calculateCustomDerivedScore({
    skills,
    talents,
    configuration: { ...customConfiguration, enabled: false }
  }),
  null
);

const recommendedSkills = {
  carrure: 20,
  agilite: 30,
  perception: 30,
  mental: 40,
  intellect: 40,
  charisme: 50
};
const hundredTalents = values(TALENTS);
hundredTalents.endurance = 30;
hundredTalents.forceBrute = 30;
hundredTalents.robustesse = 30;
hundredTalents.agiliteCorporelle = 10;

assert.deepEqual(
  calculateCreationDiagnostics({
    skills: recommendedSkills,
    talents: hundredTalents
  }),
  {
    skillValues: [20, 30, 30, 40, 40, 50],
    skillDistributionRecommended: true,
    talentTotal: 100,
    talentTotalRecommended: true,
    warnings: []
  }
);

const underTalents = { ...hundredTalents, agiliteCorporelle: 9 };
assert.deepEqual(
  calculateCreationDiagnostics({
    skills: { ...recommendedSkills, charisme: 49 },
    talents: underTalents
  }).warnings,
  ["skills", "talents-under"]
);

const overTalents = { ...hundredTalents, agiliteCorporelle: 11 };
assert.deepEqual(
  calculateCreationDiagnostics({
    skills: recommendedSkills,
    talents: overTalents
  }).warnings,
  ["talents-over"]
);

assert.equal(calculateInitiativeBonus(0), 0);
assert.equal(calculateInitiativeBonus(44), 4);
assert.equal(calculateInitiativeBonus(45), 5);
assert.equal(calculateInitiativeBonus(99), 10);

const immutableSkills = structuredClone(skills);
const immutableTalents = structuredClone(talents);
const built = buildCharacterDerivedData({
  skills,
  talents,
  wounds: 4,
  stress: 7,
  statePenaltyCoefficient: 3,
  customDerived: customConfiguration
});

assert.equal(built.statePenalty, 15);
assert.equal(built.scores.melee, 45);
assert.equal(built.scores.custom, 35);
assert.equal(built.initiativeBonus, 5);
assert.deepEqual(skills, immutableSkills);
assert.deepEqual(talents, immutableTalents);

console.log("OK — calculs dérivés, états et diagnostics de création.");
