import { EQUIPMENT_CATEGORIES } from "../constants.mjs";

const { ItemSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;

export class InterfaceEquipmentSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["interface", "interface-sheet", "interface-equipment-sheet"],
    tag: "form",
    position: {
      width: 560,
      height: 620
    },
    form: {
      closeOnSubmit: false,
      submitOnChange: true
    }
  };

  static PARTS = {
    form: {
      template: "systems/interface/templates/item/equipment-sheet.hbs",
      scrollable: [".interface-sheet__body"]
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const system = this.item.system.toObject();

    return {
      ...context,
      item: this.item,
      system,
      categories: [
        {
          value: EQUIPMENT_CATEGORIES.ORDINARY,
          label: "INTERFACE.Equipment.CategoryOrdinary",
          selected: system.category === EQUIPMENT_CATEGORIES.ORDINARY
        },
        {
          value: EQUIPMENT_CATEGORIES.WEAPON,
          label: "INTERFACE.Equipment.CategoryWeapon",
          selected: system.category === EQUIPMENT_CATEGORIES.WEAPON
        }
      ],
      isWeapon: system.category === EQUIPMENT_CATEGORIES.WEAPON
    };
  }
}
