import {
  DEFAULT_IMAGES,
  SYSTEM_ID
} from "../constants.mjs";
import { D100_MODES } from "../rules/d100/constants.mjs";
import { snapshotActorWeapons } from "../services/weapon-snapshot-service.mjs";
import { resolveActorTheme } from "../services/theme-service.mjs";
import {
  CHAT_CARD_TYPES,
  DAMAGE_MODES,
  buildD100GmData,
  buildD100PublicData,
  buildDamageResultPublicData,
  buildWeaponSelectorPublicData,
  cardEnvelope
} from "./chat-card-data.mjs";

const TEMPLATE_ROOT = "systems/interface/templates/chat";

const TEMPLATES = Object.freeze({
  [CHAT_CARD_TYPES.D100_RESULT]: `${TEMPLATE_ROOT}/d100-result.hbs`,
  [CHAT_CARD_TYPES.D100_GM_DETAIL]: `${TEMPLATE_ROOT}/d100-gm-detail.hbs`,
  [CHAT_CARD_TYPES.WEAPON_SELECTOR]: `${TEMPLATE_ROOT}/weapon-selector.hbs`,
  [CHAT_CARD_TYPES.DAMAGE_RESULT]: `${TEMPLATE_ROOT}/damage-result.hbs`
});

function localize(key) {
  return game.i18n.localize(key);
}

function format(key, data) {
  return game.i18n.format(key, data);
}

function signed(value) {
  const number = Number(value) || 0;
  return number > 0 ? `+${number}` : String(number);
}

function qualificationKey(qualification) {
  if (qualification?.superCritical) {
    return qualification.success
      ? "INTERFACE.D100.Quality.SuperCriticalSuccess"
      : "INTERFACE.D100.Quality.SuperCriticalFailure";
  }
  if (qualification?.automatic && qualification?.critical) {
    return qualification.success
      ? "INTERFACE.D100.Quality.AutomaticCriticalSuccess"
      : "INTERFACE.D100.Quality.AutomaticCriticalFailure";
  }
  if (qualification?.critical) {
    return qualification.success
      ? "INTERFACE.D100.Quality.CriticalSuccess"
      : "INTERFACE.D100.Quality.CriticalFailure";
  }
  if (qualification?.automatic) {
    return qualification.success
      ? "INTERFACE.D100.Quality.AutomaticSuccess"
      : "INTERFACE.D100.Quality.AutomaticFailure";
  }
  return qualification?.success
    ? "INTERFACE.D100.Quality.Success"
    : "INTERFACE.D100.Quality.Failure";
}

function marginLabel(margin) {
  const key = margin?.kind === "success"
    ? "INTERFACE.Chat.D100.SuccessMargin"
    : "INTERFACE.Chat.D100.FailureMargin";
  return format(key, { value: margin?.value ?? 0 });
}

function penaltyTooltip(penalties) {
  const parts = [];
  if (penalties?.wounds > 0) {
    parts.push(format("INTERFACE.Chat.Penalty.Wounds", {
      value: penalties.wounds
    }));
  }
  if (penalties?.stress > 0) {
    parts.push(format("INTERFACE.Chat.Penalty.Stress", {
      value: penalties.stress
    }));
  }
  if (penalties?.roll > 0) {
    parts.push(format("INTERFACE.Chat.Penalty.Roll", {
      value: penalties.roll
    }));
  }
  return parts.join(" | ");
}

function resultTooltip(data) {
  const parts = [];
  if (
    data.mode === D100_MODES.ADVANTAGE
    || data.mode === D100_MODES.DISADVANTAGE
  ) {
    parts.push(format("INTERFACE.Chat.D100.NaturalRollsTooltip", {
      values: data.naturalValues.join(" | ")
    }));
  }
  if (data.destinyIntervened) {
    parts.push(format("INTERFACE.Chat.D100.DestinyTooltip", {
      raw: data.rawResult,
      correction: signed(data.destinyCorrection),
      final: data.finalResult
    }));
  }
  return parts.join("\n");
}

function actorImage(actor) {
  return String(actor?.img ?? "").trim() || DEFAULT_IMAGES.ACTOR;
}

function commonView(actor) {
  return {
    theme: resolveActorTheme(actor),
    actorName: String(actor?.name ?? ""),
    actorImg: actorImage(actor),
    compactActorName: String(actor?.name ?? "").length > 24
  };
}

async function renderCard(type, data) {
  const path = TEMPLATES[type];
  if (!path) throw new Error(`Template de carte inconnu : ${type}`);
  return foundry.applications.handlebars.renderTemplate(path, data);
}

function messageFlags(card) {
  return {
    [SYSTEM_ID]: {
      // Les DataModels Foundry nettoient et peuvent réécrire les données
      // candidates pendant la construction du Document. Ne jamais leur
      // transmettre directement notre enveloppe interne gelée.
      card: structuredClone(card)
    }
  };
}

function baseMessageData(actor, content, card) {
  const ChatMessageClass = foundry.documents.ChatMessage;
  return {
    user: game.user.id,
    speaker: ChatMessageClass.getSpeaker({ actor }),
    content,
    flags: messageFlags(card)
  };
}

function gmUserIds() {
  return Array.from(game.users ?? [])
    .filter(user => user?.isGM)
    .map(user => user.id)
    .filter(Boolean);
}

function d100View(actor, publicData) {
  const tooltip = resultTooltip(publicData);
  return {
    ...commonView(actor),
    jetName: publicData.source.name,
    compactJetName: publicData.source.name.length > 28,
    score: publicData.threshold,
    hasPenalty: publicData.penalties.total > 0,
    penaltyTotal: publicData.penalties.total,
    penaltyTooltip: penaltyTooltip(publicData.penalties),
    finalResult: publicData.finalResult,
    resultClass: `interface-result--${publicData.resultTone}`,
    resultLabel: localize(qualificationKey(publicData.qualification)),
    resultTooltip: tooltip,
    hasResultTooltip: tooltip.length > 0,
    showMargin: publicData.margin.value > 0,
    marginLabel: marginLabel(publicData.margin),
    destinyIntervened: publicData.destinyIntervened,
    showForceDamage:
      publicData.context.kind === "combat"
      && publicData.qualification.success !== true,
    forceDamageLabel: localize("INTERFACE.Chat.Damage.Allow")
  };
}

function selectorView(actor, publicData) {
  const undefinedDamageLabel = localize("INTERFACE.Chat.Damage.Undefined");
  const weapons = publicData.weapons.map((weapon, index) => {
    const valid = weapon.formulaValidAtCreation === true;
    return {
      ...weapon,
      index,
      valid,
      buttonTitle: valid ? weapon.name : undefinedDamageLabel
    };
  });
  const rollableWeapons = weapons.filter(weapon => weapon.valid);

  return {
    ...commonView(actor),
    chooseWeaponLabel: localize("INTERFACE.Chat.Damage.ChooseWeapon"),
    weapons,
    hasWeapons: weapons.length > 0,
    hasRollableWeapons: rollableWeapons.length > 0,
    noWeaponsLabel: localize("INTERFACE.Chat.Damage.NoWeapons"),
    undefinedDamageLabel
  };
}

export async function createWeaponSelectorMessage({
  actor,
  weapons,
  origin = "success",
  qualification = {}
}) {
  const publicData = buildWeaponSelectorPublicData({
    actor: {
      name: actor?.name,
      img: actorImage(actor)
    },
    weapons,
    origin,
    qualification
  });
  const card = cardEnvelope({
    type: CHAT_CARD_TYPES.WEAPON_SELECTOR,
    actorUuid: actor?.uuid,
    publicData
  });
  const content = await renderCard(
    CHAT_CARD_TYPES.WEAPON_SELECTOR,
    selectorView(actor, publicData)
  );

  return foundry.documents.ChatMessage.create(
    baseMessageData(actor, content, card)
  );
}

async function createGmDetailMessage({
  actor,
  result,
  destinyConfig
}) {
  if (result?.destiny?.tested !== true) return null;

  // Sans canal autoritaire dédié, un joueur ne doit pas créer lui-même un
  // message contenant le secret du Destin : l'auteur d'un whisper peut voir
  // son propre message. Le détail persistant est donc réservé aux résolutions
  // effectuées sur un client MJ.
  if (!game.user?.isGM) return null;

  const whisper = gmUserIds();
  if (whisper.length === 0) {
    console.warn(
      "D100 Interface | Détail MJ du Destin non persisté : aucun MJ destinataire."
    );
    return null;
  }

  const gmData = buildD100GmData({ actor, result, destinyConfig });
  const card = cardEnvelope({
    type: CHAT_CARD_TYPES.D100_GM_DETAIL,
    actorUuid: actor?.uuid,
    gmData
  });
  const content = await renderCard(CHAT_CARD_TYPES.D100_GM_DETAIL, {
    ...commonView(actor),
    title: localize("INTERFACE.Chat.GM.Title"),
    sourceName: gmData.sourceName,
    rawLabel: format("INTERFACE.Chat.GM.Raw", {
      value: gmData.rawResult
    }),
    secretLabel: format("INTERFACE.Chat.GM.SecretRoll", {
      value: gmData.destiny.secretRoll ?? "—"
    }),
    chanceLabel: format("INTERFACE.Chat.GM.TriggerChance", {
      value: gmData.destiny.triggerChance ?? "—"
    }),
    correctionLabel: format("INTERFACE.Chat.GM.Correction", {
      value: signed(gmData.destiny.correction)
    }),
    reserveLabel: format("INTERFACE.Chat.GM.Reserve", {
      before: gmData.destiny.before,
      after: gmData.destiny.after
    }),
    reasonLabel: format("INTERFACE.Chat.GM.Reason", {
      value: gmData.destiny.reason || "—"
    })
  });

  return foundry.documents.ChatMessage.create({
    ...baseMessageData(actor, content, card),
    whisper
  });
}

export async function publishD100Resolution({
  actor,
  result,
  destinyConfig = {}
}) {
  const combatSuccess =
    result?.context?.kind === "combat"
    && result?.finalQualification?.success === true;
  const weapons = combatSuccess ? snapshotActorWeapons(actor) : [];

  const publicData = buildD100PublicData({
    actor: {
      name: actor?.name,
      img: actorImage(actor)
    },
    result,
    weapons
  });
  const publicCard = cardEnvelope({
    type: CHAT_CARD_TYPES.D100_RESULT,
    actorUuid: actor?.uuid,
    publicData
  });
  const content = await renderCard(
    CHAT_CARD_TYPES.D100_RESULT,
    d100View(actor, publicData)
  );
  const publicMessage = await foundry.documents.ChatMessage.create(
    baseMessageData(actor, content, publicCard)
  );

  let gmMessage = null;
  try {
    gmMessage = await createGmDetailMessage({
      actor,
      result,
      destinyConfig
    });
  } catch (error) {
    console.error(
      "D100 Interface | Impossible de créer le détail MJ du Destin",
      error
    );
  }

  let weaponSelectorMessage = null;
  if (combatSuccess) {
    try {
      weaponSelectorMessage = await createWeaponSelectorMessage({
        actor,
        weapons,
        origin: "success",
        qualification: result.finalQualification
      });
    } catch (error) {
      console.error(
        "D100 Interface | Impossible de créer la carte de dégâts",
        error
      );
      ui.notifications.error(
        format("INTERFACE.Chat.Damage.SelectorError", {
          message: error?.message ?? String(error)
        })
      );
    }
  }

  return Object.freeze({
    publicMessage,
    gmMessage,
    weaponSelectorMessage
  });
}

export async function createDamageResultMessage({
  actor,
  parentMessageId,
  weapon,
  total,
  mode = DAMAGE_MODES.NORMAL
}) {
  const publicData = buildDamageResultPublicData({
    actor: {
      name: actor?.name,
      img: actorImage(actor)
    },
    parentMessageId,
    weapon,
    total,
    mode
  });
  const card = cardEnvelope({
    type: CHAT_CARD_TYPES.DAMAGE_RESULT,
    actorUuid: actor?.uuid,
    publicData
  });
  const weaponName = String(weapon?.name ?? "");
  const content = await renderCard(CHAT_CARD_TYPES.DAMAGE_RESULT, {
    ...commonView(actor),
    title: localize("INTERFACE.Chat.Damage.ResultTitle"),
    total,
    weaponName,
    weaponImg: weapon.img,
    compactWeaponName: weaponName.length > 18,
    extraCompactWeaponName: weaponName.length > 28,
    modeLabel: mode === DAMAGE_MODES.MAXIMUM
      ? localize("INTERFACE.Chat.Damage.MaximumActivated")
      : ""
  });

  return foundry.documents.ChatMessage.create(
    baseMessageData(actor, content, card)
  );
}
