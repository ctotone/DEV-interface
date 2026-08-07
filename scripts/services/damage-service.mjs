import {
  isUsableWeaponSnapshot,
  validateDamageFormula
} from "./weapon-snapshot-service.mjs";

function damageError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export async function rollWeaponDamage(
  snapshot,
  { maximize = false } = {}
) {
  if (!isUsableWeaponSnapshot(snapshot)) {
    throw damageError(
      "INVALID_SNAPSHOT",
      "Le snapshot d'arme est invalide."
    );
  }

  const formula = String(snapshot.damageFormula ?? "").trim();
  if (!formula) {
    throw damageError(
      "EMPTY_FORMULA",
      "La formule de dégâts est vide."
    );
  }

  if (
    snapshot.formulaValidAtCreation !== true
    || !validateDamageFormula(formula)
  ) {
    throw damageError(
      "INVALID_FORMULA",
      "La formule de dégâts est invalide."
    );
  }

  const roll = new Roll(formula);
  await roll.evaluate({
    allowInteractive: false,
    maximize: maximize === true
  });

  const total = Number(roll.total);
  if (!Number.isFinite(total)) {
    throw damageError(
      "INVALID_TOTAL",
      "Le jet de dégâts n'a pas produit de total numérique."
    );
  }

  return Object.freeze({
    roll,
    total,
    formula,
    maximized: maximize === true
  });
}
