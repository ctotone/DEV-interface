import { EQUIPMENT_CATEGORIES } from "../constants.mjs";
import { htmlField, integerField, textField } from "./fields.mjs";

const fields = foundry.data.fields;

export class EquipmentData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: htmlField(),
      category: new fields.StringField({
        required: true,
        nullable: false,
        blank: false,
        initial: EQUIPMENT_CATEGORIES.ORDINARY,
        choices: Object.values(EQUIPMENT_CATEGORIES)
      }),
      quantity: integerField({ min: 1, initial: 1 }),
      damage: new fields.SchemaField({
        formula: textField()
      })
    };
  }
}
