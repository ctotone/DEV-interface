const fields = foundry.data.fields;

export function integerField({ initial = 0, min = undefined, max = undefined } = {}) {
  return new fields.NumberField({
    required: true,
    nullable: false,
    integer: true,
    initial,
    min,
    max
  });
}

export function textField({ initial = "", blank = true } = {}) {
  return new fields.StringField({
    required: true,
    nullable: false,
    blank,
    initial
  });
}

export function htmlField() {
  return new fields.HTMLField({
    required: true,
    nullable: false,
    blank: true,
    initial: ""
  });
}

export function booleanField({ initial = false } = {}) {
  return new fields.BooleanField({
    required: true,
    nullable: false,
    initial
  });
}
