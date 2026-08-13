import assert from "node:assert/strict";

const {
  DEFAULT_INTERFACE_THEME,
  interfaceThemeClass,
  normalizeInterfaceTheme,
  resolveActorTheme,
  resolveInterfaceTheme,
  resolveItemTheme
} = await import("../../scripts/services/theme-service.mjs");

assert.equal(DEFAULT_INTERFACE_THEME, "default");
assert.equal(resolveInterfaceTheme(), "default");
assert.equal(resolveActorTheme({ uuid: "Actor.test" }), "default");
assert.equal(resolveItemTheme({ uuid: "Item.test" }), "default");

assert.equal(normalizeInterfaceTheme("default"), "default");
assert.equal(normalizeInterfaceTheme("future-theme_2"), "future-theme_2");
assert.equal(normalizeInterfaceTheme(""), "default");
assert.equal(normalizeInterfaceTheme("theme dangereux!"), "default");

assert.equal(interfaceThemeClass(), "interface-theme--default");
assert.equal(
  interfaceThemeClass("future-theme_2"),
  "interface-theme--future-theme_2"
);
assert.equal(
  interfaceThemeClass('"><script>'),
  "interface-theme--default"
);

console.log("OK — fondation de thème sans persistance.");
