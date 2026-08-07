import { SYSTEM_ID } from "../constants.mjs";
import { rollWeaponDamage } from "../services/damage-service.mjs";
import {
  isUsableWeaponSnapshot,
  snapshotActorWeapons
} from "../services/weapon-snapshot-service.mjs";
import {
  CHAT_CARD_TYPES,
  DAMAGE_MODES,
  isCardType,
  isKnownCard
} from "./chat-card-data.mjs";
import {
  createDamageResultMessage,
  createWeaponSelectorMessage
} from "./chat-message-service.mjs";

const ACTIVE_CHAT_ACTIONS = new Set();

function localize(key) {
  return game.i18n.localize(key);
}

function format(key, data) {
  return game.i18n.format(key, data);
}

function getCard(message) {
  return message?.getFlag?.(SYSTEM_ID, "card")
    ?? message?.flags?.[SYSTEM_ID]?.card
    ?? null;
}

function resolveActor(card) {
  if (!card?.actorUuid) return null;
  try {
    return foundry.utils.fromUuidSync(card.actorUuid) ?? null;
  } catch (_error) {
    return null;
  }
}

function canUseActor(actor) {
  return Boolean(actor?.canUserModify?.(game.user, "update"));
}

function actionKey(message, action, suffix = "") {
  return `${message?.id ?? "unknown"}:${action}:${suffix}`;
}

async function withActionLock(key, callback) {
  if (ACTIVE_CHAT_ACTIONS.has(key)) {
    ui.notifications.warn(
      localize("INTERFACE.Chat.Damage.ActionAlreadyRunning")
    );
    return null;
  }

  ACTIVE_CHAT_ACTIONS.add(key);
  try {
    return await callback();
  } finally {
    ACTIVE_CHAT_ACTIONS.delete(key);
  }
}

async function requestDamageMode() {
  const DialogV2 = foundry.applications.api.DialogV2;
  return DialogV2.wait({
    classes: ["interface", "interface-damage-choice-dialog"],
    window: {
      title: localize("INTERFACE.Chat.Damage.ChooseModeTitle")
    },
    content: `<p>${localize("INTERFACE.Chat.Damage.ChooseModeHint")}</p>`,
    modal: true,
    buttons: [
      {
        action: DAMAGE_MODES.NORMAL,
        label: localize("INTERFACE.Chat.Damage.Normal"),
        default: true
      },
      {
        action: DAMAGE_MODES.MAXIMUM,
        label: localize("INTERFACE.Chat.Damage.Maximum")
      }
    ],
    rejectClose: false
  });
}

function messageList() {
  if (Array.isArray(game.messages?.contents)) return game.messages.contents;
  if (game.messages && Symbol.iterator in Object(game.messages)) {
    return Array.from(game.messages);
  }
  return [];
}

export function latestDamageResultForSelector(
  messages,
  parentMessageId
) {
  const candidates = Array.from(messages ?? [])
    .map(message => ({
      message,
      card: getCard(message)
    }))
    .filter(({ card }) => (
      isCardType(card, CHAT_CARD_TYPES.DAMAGE_RESULT)
      && card.publicData?.parentMessageId === parentMessageId
    ));

  candidates.sort((left, right) => {
    const leftTime = Number(left.message?.timestamp)
      || Number(left.card?.publicData?.createdAt)
      || 0;
    const rightTime = Number(right.message?.timestamp)
      || Number(right.card?.publicData?.createdAt)
      || 0;
    if (leftTime !== rightTime) return rightTime - leftTime;
    return String(right.message?.id ?? "")
      .localeCompare(String(left.message?.id ?? ""));
  });

  return candidates[0]?.card?.publicData ?? null;
}

function projectDamageResult(cardRoot, publicData) {
  const output = cardRoot?.querySelector?.("[data-interface-damage-output]");
  if (!output || !publicData) return;

  output.textContent = format("INTERFACE.Chat.Damage.Result", {
    value: publicData.total
  });
  output.dataset.state = "result";
  output.title = [
    publicData.weapon?.name,
    publicData.mode === DAMAGE_MODES.MAXIMUM
      ? localize("INTERFACE.Chat.Damage.Maximum")
      : localize("INTERFACE.Chat.Damage.Normal")
  ].filter(Boolean).join(" — ");
}

function refreshSelectorProjection(cardRoot, message) {
  const latest = latestDamageResultForSelector(
    messageList(),
    message.id
  );
  if (latest) projectDamageResult(cardRoot, latest);
}

function findRenderedMessage(messageId) {
  if (typeof document === "undefined") return null;
  const elements = document.querySelectorAll?.("[data-message-id]") ?? [];
  return Array.from(elements).find(
    element => element.dataset?.messageId === messageId
  ) ?? null;
}

function refreshRenderedSelector(messageId) {
  const message = game.messages?.get?.(messageId);
  if (!message) return;

  const rendered = findRenderedMessage(messageId);
  const cardRoot = rendered?.querySelector?.("[data-interface-card]");
  if (!cardRoot) return;
  refreshSelectorProjection(cardRoot, message);
}

function renderDamageRecord(message, html, card) {
  const parentMessageId = card.publicData?.parentMessageId;
  if (!parentMessageId) return;

  const parentExists = Boolean(game.messages?.get?.(parentMessageId));
  if (!parentExists) return;

  html.hidden = true;
  queueMicrotask(() => refreshRenderedSelector(parentMessageId));
}

function degradeUnknownCard(html) {
  const root = html.querySelector?.("[data-interface-card]");
  if (!root) return;

  root.replaceChildren();
  root.classList.add("interface-chat-card--degraded");
  const paragraph = document.createElement("p");
  paragraph.textContent = localize("INTERFACE.Chat.Card.Unsupported");
  root.append(paragraph);
}

function appendActorMissingNotice(cardRoot) {
  if (!cardRoot || cardRoot.querySelector?.("[data-interface-actor-missing]")) {
    return;
  }
  const notice = document.createElement("p");
  notice.dataset.interfaceActorMissing = "true";
  notice.className = "interface-chat-card__notice";
  notice.textContent = localize("INTERFACE.Chat.Card.ActorMissing");
  cardRoot.append(notice);
}

async function forceDamage(message, card, actor) {
  if (!game.user?.isGM) {
    ui.notifications.warn(localize("INTERFACE.Chat.Card.GMOnly"));
    return;
  }
  if (
    !isCardType(card, CHAT_CARD_TYPES.D100_RESULT)
    || card.publicData?.context?.kind !== "combat"
    || card.publicData?.qualification?.success === true
  ) {
    ui.notifications.error(localize("INTERFACE.Chat.Card.InvalidAction"));
    return;
  }
  if (!actor) {
    ui.notifications.error(localize("INTERFACE.Chat.Card.ActorMissing"));
    return;
  }

  const weapons = snapshotActorWeapons(actor);
  await createWeaponSelectorMessage({
    actor,
    weapons,
    origin: "gm-forced-failure",
    qualification: {
      success: false,
      critical: false,
      superCritical: false
    }
  });
}

async function rollDamage(message, card, actor, button) {
  if (!isCardType(card, CHAT_CARD_TYPES.WEAPON_SELECTOR)) {
    ui.notifications.error(localize("INTERFACE.Chat.Card.InvalidAction"));
    return;
  }
  if (!actor) {
    ui.notifications.error(localize("INTERFACE.Chat.Card.ActorMissing"));
    return;
  }
  if (!canUseActor(actor)) {
    ui.notifications.warn(localize("INTERFACE.Chat.Card.NoPermission"));
    return;
  }

  const index = Number.parseInt(button.dataset.weaponIndex ?? "", 10);
  const snapshot = card.publicData?.weapons?.[index];
  if (!Number.isInteger(index) || !isUsableWeaponSnapshot(snapshot)) {
    ui.notifications.error(
      localize("INTERFACE.Chat.Damage.InvalidSnapshot")
    );
    return;
  }
  if (snapshot.formulaValidAtCreation !== true) {
    ui.notifications.warn(localize("INTERFACE.Chat.Damage.Undefined"));
    return;
  }

  const key = actionKey(message, "roll-damage");
  await withActionLock(key, async () => {
    let mode = DAMAGE_MODES.NORMAL;
    if (card.publicData?.allowMaximum === true) {
      mode = await requestDamageMode();
      if (!mode) return;
    }

    try {
      const damage = await rollWeaponDamage(snapshot, {
        maximize: mode === DAMAGE_MODES.MAXIMUM
      });
      const damageMessage = await createDamageResultMessage({
        actor,
        parentMessageId: message.id,
        weapon: snapshot,
        total: damage.total,
        mode
      });
      const damageCard = getCard(damageMessage);
      const cardRoot = button.closest?.("[data-interface-card]");
      if (damageCard?.publicData) {
        projectDamageResult(cardRoot, damageCard.publicData);
      }
    } catch (error) {
      console.error("D100 Interface | Échec du jet de dégâts", error);
      const keyByCode = {
        EMPTY_FORMULA: "INTERFACE.Chat.Damage.Undefined",
        INVALID_FORMULA: "INTERFACE.Chat.Damage.InvalidFormula",
        INVALID_SNAPSHOT: "INTERFACE.Chat.Damage.InvalidSnapshot"
      };
      const localizationKey = keyByCode[error?.code];
      if (localizationKey) {
        ui.notifications.error(localize(localizationKey));
      } else {
        ui.notifications.error(
          format("INTERFACE.Chat.Damage.RollError", {
            message: error?.message ?? String(error)
          })
        );
      }
    }
  });
}

async function handleCardAction(event, message, card, actor) {
  const button = event.target?.closest?.("[data-interface-action]");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  const currentCard = getCard(message);
  if (!isKnownCard(currentCard) || currentCard.schema !== card.schema) {
    ui.notifications.error(localize("INTERFACE.Chat.Card.Unsupported"));
    return;
  }

  const currentActor = resolveActor(currentCard);
  const action = button.dataset.interfaceAction;

  if (action === "force-damage") {
    await withActionLock(
      actionKey(message, action),
      () => forceDamage(message, currentCard, currentActor)
    );
    return;
  }

  if (action === "roll-damage") {
    await rollDamage(message, currentCard, currentActor, button);
  }
}

function configureActions(cardRoot, message, card, actor) {
  const buttons = cardRoot.querySelectorAll?.("[data-interface-action]") ?? [];

  for (const button of buttons) {
    const action = button.dataset.interfaceAction;

    if (action === "force-damage") {
      button.hidden = !game.user?.isGM;
    } else if (action === "roll-damage") {
      const validWeapon = button.dataset.interfaceWeaponValid !== "false";
      button.disabled = !validWeapon || !canUseActor(actor);
      button.classList.toggle(
        "interface-chat-card__weapon-button--readonly",
        validWeapon && button.disabled
      );
    }
  }

  cardRoot.addEventListener(
    "click",
    event => void handleCardAction(event, message, card, actor)
  );
}

export function renderInterfaceChatMessage(message, html) {
  const card = getCard(message);
  if (!card) return;

  if (!isKnownCard(card)) {
    degradeUnknownCard(html);
    return;
  }

  if (card.type === CHAT_CARD_TYPES.DAMAGE_RESULT) {
    renderDamageRecord(message, html, card);
    return;
  }

  const cardRoot = html.querySelector?.("[data-interface-card]");
  if (!cardRoot) return;

  const actor = resolveActor(card);
  if (
    !actor
    && card.type !== CHAT_CARD_TYPES.D100_GM_DETAIL
  ) {
    appendActorMissingNotice(cardRoot);
  }

  configureActions(cardRoot, message, card, actor);

  if (card.type === CHAT_CARD_TYPES.WEAPON_SELECTOR) {
    refreshSelectorProjection(cardRoot, message);
  }
}

export function registerChatCardHooks() {
  Hooks.on("renderChatMessageHTML", renderInterfaceChatMessage);
}
