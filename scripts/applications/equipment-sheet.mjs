import {
  DEFAULT_IMAGES,
  EQUIPMENT_CATEGORIES
} from "../constants.mjs";
import { resolveItemTheme } from "../services/theme-service.mjs";

const { ItemSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;
const { FilePicker } = foundry.applications.apps;

function canUpdateItem(sheet) {
  return sheet.item?.canUserModify?.(game.user, "update") ?? true;
}


async function saveAndCloseAction() {
  if (!canUpdateItem(this)) return null;

  await this.submit();
  return this.close();
}

async function chooseImageAction() {
  if (!canUpdateItem(this)) return null;

  await this.submit();
  const current = String(this.item.img ?? "").trim()
    || DEFAULT_IMAGES.EQUIPMENT[this.item.system.category];
  const picker = new FilePicker({
    type: "image",
    current,
    callback: path => this.item.update({ img: path })
  });
  return picker.render({ force: true });
}

export class InterfaceEquipmentSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["interface", "interface-sheet", "interface-equipment-sheet"],
    tag: "form",
    position: {
      width: 560,
      height: 620
    },
    window: {
      resizable: true
    },
    actions: {
      chooseImage: chooseImageAction,
      saveAndClose: saveAndCloseAction
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
      theme: resolveItemTheme(this.item),
      itemCategory: system.category,
      image: String(this.item.img ?? "").trim()
        || DEFAULT_IMAGES.EQUIPMENT[system.category],
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
