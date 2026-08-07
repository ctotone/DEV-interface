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

export function registerInitiativeHooks() {
  Hooks.on("updateCombatant", onUpdateCombatant);
}
