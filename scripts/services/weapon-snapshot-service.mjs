import {
  DEFAULT_IMAGES,
  EQUIPMENT_CATEGORIES,
  ITEM_TYPES
} from "../constants.mjs";

export function isWeaponItem(item) {
  return item?.type === ITEM_TYPES.EQUIPMENT
    && item?.system?.category === EQUIPMENT_CATEGORIES.WEAPON;
}

export function validateDamageFormula(formula, validator = null) {
  const normalized = String(formula ?? "").trim();
  if (!normalized) return false;

  const validate = validator ?? (value => Roll.validate(value));
  try {
    return validate(normalized) === true;
  } catch (_error) {
    return false;
  }
}

export function createWeaponSnapshot(item, { validator = null } = {}) {
  const damageFormula = String(item?.system?.damage?.formula ?? "").trim();

  return Object.freeze({
    itemUuid: String(item?.uuid ?? ""),
    name: String(item?.name ?? ""),
    img: String(item?.img ?? "").trim()
      || DEFAULT_IMAGES.EQUIPMENT[EQUIPMENT_CATEGORIES.WEAPON],
    damageFormula,
    formulaValidAtCreation: validateDamageFormula(
      damageFormula,
      validator
    ),
    sort: Number.isFinite(Number(item?.sort)) ? Number(item.sort) : 0
  });
}

export function snapshotActorWeapons(actor, options = {}) {
  return Object.freeze(
    Array.from(actor?.items ?? [])
      .filter(isWeaponItem)
      .map(item => createWeaponSnapshot(item, options))
      .sort((left, right) => (
        left.sort - right.sort
        || left.name.localeCompare(right.name)
      ))
  );
}

export function isUsableWeaponSnapshot(snapshot) {
  return Boolean(
    snapshot
    && typeof snapshot === "object"
    && typeof snapshot.itemUuid === "string"
    && typeof snapshot.name === "string"
    && typeof snapshot.img === "string"
    && typeof snapshot.damageFormula === "string"
    && typeof snapshot.formulaValidAtCreation === "boolean"
    && Number.isFinite(Number(snapshot.sort))
  );
}
