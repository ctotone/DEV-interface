function format(key, data) {
  return game.i18n.format(key, data);
}

function combatantsOf(combat) {
  if (Array.isArray(combat?.combatants?.contents)) {
    return combat.combatants.contents;
  }
  if (combat?.combatants && Symbol.iterator in Object(combat.combatants)) {
    return Array.from(combat.combatants);
  }
  return [];
}

function combatantsForActor(combat, actor) {
  if (!combat || !actor) return [];
  if (typeof combat.getCombatantsByActor === "function") {
    return combat.getCombatantsByActor(actor);
  }

  return combatantsOf(combat).filter(combatant => (
    combatant?.actor === actor
    || (
      actor.id
      && combatant?.actorId
      && combatant.actorId === actor.id
    )
  ));
}

export function canRollInitiativeFromSheet(
  actor,
  {
    combat = globalThis.game?.combat ?? null,
    user = globalThis.game?.user ?? null
  } = {}
) {
  if (!actor || !combat || !user) return false;
  if (actor.canUserModify?.(user, "update") !== true) return false;

  return combatantsForActor(combat, actor).length === 0;
}

export async function rollActorInitiativeFromSheet(
  actor,
  {
    combat = globalThis.game?.combat ?? null,
    user = globalThis.game?.user ?? null
  } = {}
) {
  if (!canRollInitiativeFromSheet(actor, { combat, user })) return null;
  if (typeof actor.rollInitiative !== "function") return null;

  const rolledCombat = await actor.rollInitiative({
    createCombatants: true,
    rerollInitiative: false
  });

  const targetCombat = rolledCombat ?? combat;
  const pendingIds = combatantsForActor(targetCombat, actor)
    .filter(combatant => combatant?.initiative == null)
    .map(combatant => combatant?.id)
    .filter(Boolean);

  // Foundry V14 peut avoir créé le Combatant sans lui avoir encore attribué
  // d’initiative dans ce flux depuis une fiche Actor. Dans ce cas, terminer
  // explicitement le flux avec l’API native Combat#rollInitiative.
  //
  // Aucun second jet n’est produit si Actor#rollInitiative a déjà rempli
  // l’initiative : seuls les Combatants dont l’initiative est encore vide
  // sont ciblés ici.
  if (
    pendingIds.length > 0
    && typeof targetCombat?.rollInitiative === "function"
  ) {
    await targetCombat.rollInitiative(pendingIds);
  }

  return targetCombat;
}

export function initiativeTieForCombatant(combat, combatant) {
  const initiative = Number(combatant?.initiative);
  if (!Number.isFinite(initiative)) return null;

  const tied = combatantsOf(combat)
    .filter(candidate => Number(candidate?.initiative) === initiative)
    .map(candidate => String(candidate?.name ?? "").trim())
    .filter(Boolean);

  if (tied.length < 2) return null;

  return Object.freeze({
    initiative,
    names: Object.freeze(tied)
  });
}

function refreshInitiativeActionButtons() {
  if (typeof document === "undefined") return;

  const buttons = document.querySelectorAll(
    "[data-interface-initiative-action]"
  );

  for (const button of buttons) {
    const root = button.closest("[data-interface-actor-uuid]");
    const actorUuid = root?.dataset.interfaceActorUuid;
    const actor = actorUuid
      ? foundry.utils.fromUuidSync(actorUuid)
      : null;

    button.disabled = !canRollInitiativeFromSheet(actor);
  }
}

function onUpdateCombatant(combatant, changed) {
  if (!game.user?.isGM) return;
  if (!Object.prototype.hasOwnProperty.call(changed ?? {}, "initiative")) {
    return;
  }

  const tie = initiativeTieForCombatant(combatant?.parent, combatant);
  if (!tie) return;

  ui.notifications.info(
    format("INTERFACE.Initiative.Tie", {
      value: tie.initiative,
      names: tie.names.join(" / ")
    })
  );
}

function onCombatStructureChanged() {
  refreshInitiativeActionButtons();
}

export function registerInitiativeHooks() {
  Hooks.on("updateCombatant", onUpdateCombatant);

  for (const hook of [
    "createCombat",
    "updateCombat",
    "deleteCombat",
    "createCombatant",
    "deleteCombatant"
  ]) {
    Hooks.on(hook, onCombatStructureChanged);
  }
}
