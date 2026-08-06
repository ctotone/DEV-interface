import assert from "node:assert/strict";

import {
  assignSkillToken,
  buildSkillTokens,
  reconcileSkillTokenAssignments,
  releaseSkillToken
} from "../../scripts/rules/character-creation.mjs";

const tokens = buildSkillTokens();
assert.deepEqual(
  tokens.map(token => token.value),
  [20, 30, 30, 40, 40, 50]
);
assert.equal(new Set(tokens.map(token => token.id)).size, 6);

const manualValues = {
  carrure: 40,
  agilite: 30,
  perception: 50,
  mental: 30,
  intellect: 20,
  charisme: 40
};
const manualAssignments = reconcileSkillTokenAssignments({
  tokens,
  skillValues: manualValues
});
assert.equal(Object.keys(manualAssignments).length, 6);
assert.equal(
  new Set(Object.values(manualAssignments)).size,
  6
);

const emptyValues = {
  carrure: 0,
  agilite: 0,
  perception: 0,
  mental: 0,
  intellect: 0,
  charisme: 0
};
const firstDrop = assignSkillToken({
  tokens,
  skillValues: emptyValues,
  assignments: {},
  tokenId: tokens[0].id,
  skillKey: "carrure"
});
assert.equal(firstDrop.skillValues.carrure, 20);
assert.equal(firstDrop.assignments[tokens[0].id], "carrure");

const movedDrop = assignSkillToken({
  tokens,
  skillValues: firstDrop.skillValues,
  assignments: firstDrop.assignments,
  tokenId: tokens[0].id,
  skillKey: "agilite"
});
assert.equal(movedDrop.skillValues.carrure, 0);
assert.equal(movedDrop.skillValues.agilite, 20);
assert.equal(movedDrop.assignments[tokens[0].id], "agilite");

const released = releaseSkillToken({
  tokens,
  skillValues: movedDrop.skillValues,
  assignments: movedDrop.assignments,
  tokenId: tokens[0].id
});
assert.equal(released.skillValues.agilite, 0);
assert.equal(released.assignments[tokens[0].id], undefined);

const duplicateThirties = reconcileSkillTokenAssignments({
  tokens,
  skillValues: {
    ...emptyValues,
    carrure: 30,
    agilite: 30,
    perception: 30
  }
});
assert.equal(Object.keys(duplicateThirties).length, 2);

console.log("OK — jetons de création et réattributions validés.");
