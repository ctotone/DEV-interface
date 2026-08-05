import { isNaturalDouble, qualifyNatural } from "./qualify-natural.mjs";

function normalizedInteger(value, fallback = 0) {
  return Number.isInteger(value) ? value : fallback;
}

function gainDestiny(before, gain, cap) {
  return Math.min(Math.max(0, cap), Math.max(0, before) + Math.max(0, gain));
}

export function assessDestinyEligibility({
  rawResult,
  rawQualification,
  finalThreshold,
  destiny
}) {
  const before = Math.max(0, normalizedInteger(destiny?.before));
  const criticalMinimum = Math.max(
    0,
    normalizedInteger(destiny?.criticalMinimum)
  );

  if (rawQualification.success) {
    return Object.freeze({
      eligible: false,
      intervention: "none",
      correctionNeeded: 0,
      reason: "raw-success"
    });
  }

  if (rawQualification.automatic) {
    return Object.freeze({
      eligible: false,
      intervention: "none",
      correctionNeeded: 0,
      reason: "automatic-failure"
    });
  }

  if (rawQualification.critical) {
    return Object.freeze({
      eligible: before >= criticalMinimum,
      intervention: "soften-critical-failure",
      correctionNeeded: 1,
      reason: before >= criticalMinimum
        ? "eligible-critical-failure"
        : "critical-reserve-insufficient"
    });
  }

  const correctionNeeded = rawResult - finalThreshold;
  if (finalThreshold <= 5) {
    return Object.freeze({
      eligible: false,
      intervention: "none",
      correctionNeeded,
      reason: "threshold-too-low"
    });
  }

  return Object.freeze({
    eligible: before >= correctionNeeded,
    intervention: "convert-failure-to-success",
    correctionNeeded,
    reason: before >= correctionNeeded
      ? "eligible-ordinary-failure"
      : "ordinary-reserve-insufficient"
  });
}

export function resolveDestiny({
  rawResult,
  rawQualification,
  finalThreshold,
  destiny,
  secretRoll = null
}) {
  const before = Math.max(0, normalizedInteger(destiny?.before));
  const gain = Math.max(0, normalizedInteger(destiny?.gain));
  const cap = Math.max(0, normalizedInteger(destiny?.cap));
  const triggerChance = Math.min(
    100,
    Math.max(0, normalizedInteger(destiny?.triggerChance))
  );
  const eligibility = assessDestinyEligibility({
    rawResult,
    rawQualification,
    finalThreshold,
    destiny
  });

  if (rawQualification.success) {
    return Object.freeze({
      before,
      eligible: false,
      tested: false,
      secretRoll: null,
      triggered: false,
      intervention: "none",
      correction: 0,
      correctionNeeded: 0,
      reason: eligibility.reason,
      after: 0,
      finalResult: rawResult
    });
  }

  if (!eligibility.eligible) {
    return Object.freeze({
      before,
      eligible: false,
      tested: false,
      secretRoll: null,
      triggered: false,
      intervention: "none",
      correction: 0,
      correctionNeeded: eligibility.correctionNeeded,
      reason: eligibility.reason,
      after: gainDestiny(before, gain, cap),
      finalResult: rawResult
    });
  }

  if (!Number.isInteger(secretRoll) || secretRoll < 1 || secretRoll > 100) {
    const error = new Error(
      "Un résultat secret D100 est requis pour résoudre le Destin."
    );
    error.code = "D100_SECRET_ROLL_REQUIRED";
    throw error;
  }

  const triggered = secretRoll <= triggerChance;
  if (!triggered) {
    return Object.freeze({
      before,
      eligible: true,
      tested: true,
      secretRoll,
      triggered: false,
      intervention: "none",
      correction: 0,
      correctionNeeded: eligibility.correctionNeeded,
      reason: "secret-test-failed",
      after: gainDestiny(before, gain, cap),
      finalResult: rawResult
    });
  }

  let finalResult;
  if (eligibility.intervention === "convert-failure-to-success") {
    finalResult = isNaturalDouble(finalThreshold)
      ? finalThreshold - 1
      : finalThreshold;
  } else {
    const lower = rawResult - 1;
    finalResult = qualifyNatural(lower, finalThreshold).success
      ? rawResult + 1
      : lower;
  }

  return Object.freeze({
    before,
    eligible: true,
    tested: true,
    secretRoll,
    triggered: true,
    intervention: eligibility.intervention,
    correction: finalResult - rawResult,
    correctionNeeded: eligibility.correctionNeeded,
    reason: "secret-test-succeeded",
    after: 0,
    finalResult
  });
}
