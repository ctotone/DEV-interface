import { qualifyNatural } from "./qualify-natural.mjs";
import { qualifyFinalResult } from "./qualify-final.mjs";
import { selectRawResult } from "./select-raw.mjs";
import {
  assessDestinyEligibility,
  resolveDestiny
} from "./resolve-destiny.mjs";
import { computeMargin } from "./compute-margin.mjs";
import { isD100Mode } from "./constants.mjs";

function clone(value) {
  return structuredClone(value);
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

function validateInput(input) {
  if (!input || input.schema !== 1) {
    throw new RangeError("Le moteur D100 attend un payload de schéma 1.");
  }
  if (!isD100Mode(input.mode)) {
    throw new RangeError(`Mode D100 inconnu : ${input.mode}`);
  }
  if (!Number.isInteger(input.threshold?.base)) {
    throw new TypeError("Le seuil de base doit être un entier.");
  }
  if (!Number.isInteger(input.threshold?.final)) {
    throw new TypeError("Le seuil final doit être un entier.");
  }
  if (
    input.threshold?.modifier !== undefined
    && !Number.isInteger(input.threshold.modifier)
  ) {
    throw new TypeError("Le bonus ou malus doit être un entier.");
  }
  if (!Array.isArray(input.naturalValues)) {
    throw new TypeError("Les dés naturels doivent être fournis.");
  }
}

export function prepareD100Resolution(input) {
  validateInput(input);
  const safeInput = clone(input);
  const naturalResults = safeInput.naturalValues.map(value =>
    qualifyNatural(value, safeInput.threshold.final)
  );
  const selection = selectRawResult(naturalResults, safeInput.mode);
  const rawResult = selection.selected.value;
  const rawQualification = selection.selected;
  const eligibility = assessDestinyEligibility({
    rawResult,
    rawQualification,
    finalThreshold: safeInput.threshold.final,
    destiny: safeInput.destiny
  });

  return deepFreeze({
    input: safeInput,
    naturalResults,
    selectedIndex: selection.selectedIndex,
    rawResult,
    rawQualification,
    destinyEligibility: eligibility
  });
}

export function resolveD100(input, { secretRoll = null } = {}) {
  const prepared = prepareD100Resolution(input);
  const destiny = resolveDestiny({
    rawResult: prepared.rawResult,
    rawQualification: prepared.rawQualification,
    finalThreshold: prepared.input.threshold.final,
    destiny: prepared.input.destiny,
    secretRoll
  });
  const finalQualification = qualifyFinalResult({
    finalResult: destiny.finalResult,
    finalThreshold: prepared.input.threshold.final
  });
  const margin = computeMargin({
    finalThreshold: prepared.input.threshold.final,
    finalResult: destiny.finalResult,
    success: finalQualification.success
  });

  return deepFreeze({
    schema: 1,
    mode: prepared.input.mode,
    source: prepared.input.source,
    state: prepared.input.state,
    threshold: prepared.input.threshold,
    naturalResults: prepared.naturalResults,
    selectedIndex: prepared.selectedIndex,
    rawResult: prepared.rawResult,
    rawQualification: prepared.rawQualification,
    destiny,
    finalResult: destiny.finalResult,
    finalQualification,
    margin,
    context: prepared.input.context ?? { kind: "general" }
  });
}
