import {
  D100_QUALITIES,
  D100_QUALITY_RANKS
} from "./constants.mjs";

function integer(value, label) {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${label} doit être un entier.`);
  }
  return value;
}

export function isNaturalDouble(value) {
  return value >= 11 && value <= 99 && value % 11 === 0;
}

export function qualifyNatural(value, finalThreshold) {
  integer(value, "Le résultat naturel");
  integer(finalThreshold, "Le seuil final");

  if (value < 1 || value > 100) {
    throw new RangeError("Le résultat naturel doit être compris entre 1 et 100.");
  }

  let success;
  let automatic = false;
  let critical = false;
  let superCritical = false;

  if (value === 1) {
    success = true;
    automatic = true;
    critical = true;
    superCritical = true;
  } else if (value <= 5) {
    success = true;
    automatic = true;
  } else if (value === 100) {
    success = false;
    automatic = true;
    critical = true;
    superCritical = true;
  } else if (value === 99) {
    success = false;
    automatic = true;
    critical = true;
  } else if (value >= 96) {
    success = false;
    automatic = true;
  } else {
    success = value <= finalThreshold;
    critical = isNaturalDouble(value);
  }

  const quality = superCritical
    ? (success ? D100_QUALITIES.SUPER_SUCCESS : D100_QUALITIES.SUPER_FAILURE)
    : critical
      ? (success ? D100_QUALITIES.CRITICAL_SUCCESS : D100_QUALITIES.CRITICAL_FAILURE)
      : (success ? D100_QUALITIES.SUCCESS : D100_QUALITIES.FAILURE);

  return Object.freeze({
    value,
    success,
    automatic,
    critical,
    superCritical,
    quality,
    rank: D100_QUALITY_RANKS[quality]
  });
}
