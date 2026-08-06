import { CharacterData } from "./data/character-data.mjs";
import { EquipmentData } from "./data/equipment-data.mjs";
import { InterfaceActor } from "./documents/interface-actor.mjs";
import { InterfaceItem } from "./documents/interface-item.mjs";
import { InterfaceCharacterSheet } from "./applications/character-sheet.mjs";
import { InterfaceEquipmentSheet } from "./applications/equipment-sheet.mjs";
import { registerInterfaceSettings } from "./settings/register-settings.mjs";
import { ACTOR_TYPES, ITEM_TYPES, SYSTEM_ID } from "./constants.mjs";

Hooks.once("init", () => {
  console.info("D100 Interface | Initialisation de la Tranche 3B");

  CONFIG.Actor.documentClass = InterfaceActor;
  CONFIG.Item.documentClass = InterfaceItem;

  CONFIG.Actor.dataModels[ACTOR_TYPES.CHARACTER] = CharacterData;
  CONFIG.Item.dataModels[ITEM_TYPES.EQUIPMENT] = EquipmentData;

  registerInterfaceSettings();

  const { DocumentSheetConfig } = foundry.applications.apps;

  DocumentSheetConfig.registerSheet(
    foundry.documents.Actor,
    SYSTEM_ID,
    InterfaceCharacterSheet,
    {
      types: [ACTOR_TYPES.CHARACTER],
      makeDefault: true,
      label: "INTERFACE.Sheet.Character"
    }
  );

  DocumentSheetConfig.registerSheet(
    foundry.documents.Item,
    SYSTEM_ID,
    InterfaceEquipmentSheet,
    {
      types: [ITEM_TYPES.EQUIPMENT],
      makeDefault: true,
      label: "INTERFACE.Sheet.Equipment"
    }
  );
});
