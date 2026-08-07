import { InterfaceCharacterCreationApplication } from "../applications/character-creation-application.mjs";
import {
  ACTOR_TYPES,
  DEFAULT_IMAGES,
  FLAG_KEYS,
  SYSTEM_ID
} from "../constants.mjs";
import { rollD100ForActor } from "../services/d100-roll-service.mjs";

const CONFLICT_DERIVED_KEYS = new Set(["melee", "distance", "verbal"]);

function withPendingCreationFlag(data) {
  const flags = structuredClone(data.flags ?? {});
  flags[SYSTEM_ID] ??= {};

  const path = FLAG_KEYS.CREATION_PENDING.split(".");
  let target = flags[SYSTEM_ID];
  for (const key of path.slice(0, -1)) {
    target[key] ??= {};
    target = target[key];
  }
  target[path.at(-1)] = true;

  return {
    ...data,
    flags
  };
}

export class InterfaceActor extends Actor {
  static async createDialog(
    data = {},
    createOptions = {},
    options = {},
    renderOptions = {}
  ) {
    const requestedType = data.type
      ?? (
        Array.isArray(options.types) && options.types.length === 1
          ? options.types[0]
          : ACTOR_TYPES.CHARACTER
      );
    const characterAllowed = !Array.isArray(options.types)
      || options.types.includes(ACTOR_TYPES.CHARACTER);
    const useCreationAssistant = requestedType === ACTOR_TYPES.CHARACTER
      && characterAllowed
      && !options.template;

    if (!useCreationAssistant) {
      return super.createDialog(
        data,
        createOptions,
        options,
        renderOptions
      );
    }

    if (!this.canUserCreate(game.user)) return null;

    const actorData = withPendingCreationFlag({
      ...data,
      name: data.name ?? this.defaultName({
        pack: createOptions.pack,
        parent: createOptions.parent,
        type: ACTOR_TYPES.CHARACTER
      }),
      type: ACTOR_TYPES.CHARACTER,
      img: String(data.img ?? "").trim() || DEFAULT_IMAGES.ACTOR
    });

    const actor = await this.create(actorData, {
      ...createOptions,
      renderSheet: false
    });
    if (!actor) return null;

    try {
      await InterfaceCharacterCreationApplication.openForActor({
        actor,
        renderOptions
      });
    } catch (error) {
      console.error(
        "D100 Interface | Actor créé mais assistant de création impossible à ouvrir",
        error
      );
      ui.notifications.error(
        game.i18n.format("INTERFACE.CreationAssistant.OpenSheetError", {
          message: error?.message ?? String(error)
        })
      );
    }

    return actor;
  }

  getRollData() {
    return {
      ...super.getRollData(),
      derived: this.system.derived
    };
  }

  async rollStandardD100({ skillKey, talentKey, mode, modifier = 0 }) {
    return rollD100ForActor({
      actor: this,
      source: {
        kind: "standard",
        skillKey,
        talentKey
      },
      mode,
      modifier,
      context: {
        kind: "general"
      }
    });
  }

  async rollDerivedD100({ key, mode, modifier = 0 }) {
    return rollD100ForActor({
      actor: this,
      source: {
        kind: "derived",
        key
      },
      mode,
      modifier,
      context: {
        kind: CONFLICT_DERIVED_KEYS.has(key) ? "combat" : "general"
      }
    });
  }
}
