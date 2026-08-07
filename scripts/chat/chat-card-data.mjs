export const CHAT_CARD_SCHEMA = 1;

export const CHAT_CARD_TYPES = Object.freeze({
  D100_RESULT: "d100-result",
  D100_GM_DETAIL: "d100-gm-detail",
  WEAPON_SELECTOR: "weapon-selector",
  DAMAGE_RESULT: "damage-result",
  INITIATIVE: "initiative"
});

export const DAMAGE_MODES = Object.freeze({
  NORMAL: "normal",
  MAXIMUM: "maximum"
});

const KNOWN_CARD_TYPES = new Set(Object.values(CHAT_CARD_TYPES));

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

function clone(value) {
  return structuredClone(value);
}

function compactQualification(qualification) {
  return {
    success: qualification?.success === true,
    automatic: qualification?.automatic === true,
    critical: qualification?.critical === true,
    superCritical: qualification?.superCritical === true,
    quality: String(qualification?.quality ?? "")
  };
}

export function resultTone(qualification) {
  if (qualification?.superCritical) {
    return qualification.success
      ? "super-critical-success"
      : "super-critical-failure";
  }
  if (qualification?.critical) {
    return qualification.success
      ? "critical-success"
      : "critical-failure";
  }
  return qualification?.success ? "success" : "failure";
}

export function buildPenaltyData(result) {
  const coefficient = Math.max(0, Number(result?.state?.coefficient) || 0);
  const wounds = Math.max(
    0,
    (Number(result?.state?.woundsLevel) || 0) * coefficient
  );
  const stress = Math.max(
    0,
    (Number(result?.state?.stressLevel) || 0) * coefficient
  );
  const roll = Math.max(0, -(Number(result?.threshold?.modifier) || 0));

  return deepFreeze({
    wounds,
    stress,
    roll,
    total: wounds + stress + roll
  });
}

function publicSource(source) {
  return {
    kind: String(source?.kind ?? ""),
    key: String(source?.key ?? ""),
    name: String(source?.displayLabel ?? source?.label ?? ""),
    score: Number(source?.baseValue) || 0
  };
}

export function buildD100PublicData({ actor, result, weapons = [] }) {
  const destinyIntervened = result?.destiny?.triggered === true;
  const qualification = compactQualification(result?.finalQualification);

  return deepFreeze({
    actorName: String(actor?.name ?? ""),
    actorImg: String(actor?.img ?? ""),
    source: publicSource(result?.source),
    mode: String(result?.mode ?? "normal"),
    threshold: Number(result?.threshold?.final) || 0,
    naturalValues: (result?.naturalResults ?? []).map(entry => entry.value),
    selectedIndex: Number.isInteger(result?.selectedIndex)
      ? result.selectedIndex
      : 0,
    rawResult: Number(result?.rawResult) || 0,
    destinyCorrection: destinyIntervened
      ? Number(result?.destiny?.correction) || 0
      : 0,
    finalResult: Number(result?.finalResult) || 0,
    qualification,
    resultTone: resultTone(qualification),
    margin: {
      kind: String(result?.margin?.kind ?? ""),
      value: Math.max(0, Number(result?.margin?.value) || 0)
    },
    penalties: buildPenaltyData(result),
    destinyIntervened,
    context: {
      kind: String(result?.context?.kind ?? "general")
    },
    weapons: clone(weapons)
  });
}

export function buildD100GmData({
  actor,
  result,
  destinyConfig = {}
}) {
  return deepFreeze({
    actorName: String(actor?.name ?? ""),
    sourceName: String(
      result?.source?.displayLabel ?? result?.source?.label ?? ""
    ),
    rawResult: Number(result?.rawResult) || 0,
    finalResult: Number(result?.finalResult) || 0,
    destiny: {
      eligible: result?.destiny?.eligible === true,
      tested: result?.destiny?.tested === true,
      secretRoll: Number.isInteger(result?.destiny?.secretRoll)
        ? result.destiny.secretRoll
        : null,
      triggerChance: Number.isInteger(destinyConfig?.triggerChance)
        ? destinyConfig.triggerChance
        : null,
      reason: String(result?.destiny?.reason ?? ""),
      intervention: String(result?.destiny?.intervention ?? "none"),
      correction: Number(result?.destiny?.correction) || 0,
      before: Number(result?.destiny?.before) || 0,
      after: Number(result?.destiny?.after) || 0
    }
  });
}

export function buildWeaponSelectorPublicData({
  actor,
  weapons,
  origin = "success",
  qualification = {}
}) {
  return deepFreeze({
    actorName: String(actor?.name ?? ""),
    actorImg: String(actor?.img ?? ""),
    origin: String(origin),
    critical: qualification?.critical === true,
    superCritical: qualification?.superCritical === true,
    allowMaximum:
      qualification?.success === true
      && (
        qualification?.critical === true
        || qualification?.superCritical === true
      ),
    weapons: clone(weapons ?? [])
  });
}

export function buildDamageResultPublicData({
  actor,
  parentMessageId,
  weapon,
  total,
  mode,
  createdAt = Date.now()
}) {
  return deepFreeze({
    parentMessageId: String(parentMessageId ?? ""),
    actorName: String(actor?.name ?? ""),
    actorImg: String(actor?.img ?? ""),
    weapon: clone(weapon),
    total: Number(total),
    mode: String(mode),
    createdAt: Number(createdAt)
  });
}

export function cardEnvelope({ type, actorUuid = "", publicData, gmData }) {
  const card = {
    schema: CHAT_CARD_SCHEMA,
    type,
    actorUuid: String(actorUuid ?? "")
  };
  if (publicData !== undefined) card.publicData = clone(publicData);
  if (gmData !== undefined) card.gmData = clone(gmData);
  return deepFreeze(card);
}

export function isKnownCard(card) {
  return Boolean(
    card
    && card.schema === CHAT_CARD_SCHEMA
    && KNOWN_CARD_TYPES.has(card.type)
  );
}

export function isCardType(card, ...types) {
  return isKnownCard(card) && types.includes(card.type);
}
