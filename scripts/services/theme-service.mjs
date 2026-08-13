export const DEFAULT_INTERFACE_THEME = "default";

const THEME_ID_PATTERN = /^[a-z0-9_-]+$/i;

/**
 * Normalise un identifiant de thème pour son usage dans le DOM.
 *
 * Phase 06A.5 :
 * - aucun choix utilisateur ;
 * - aucune persistance ;
 * - "default" reste l'unique thème résolu.
 */
export function normalizeInterfaceTheme(theme) {
  const value = String(theme ?? "").trim();
  return THEME_ID_PATTERN.test(value)
    ? value
    : DEFAULT_INTERFACE_THEME;
}

/**
 * Point d'extension générique du système.
 * La source future du thème n'est volontairement pas définie ici.
 */
export function resolveInterfaceTheme(_subject = null) {
  return DEFAULT_INTERFACE_THEME;
}

/**
 * Compatibilité avec le point d'extension introduit pour les Actors/cartes.
 */
export function resolveActorTheme(actor) {
  return resolveInterfaceTheme(actor);
}

/**
 * Point d'extension symétrique pour les Items.
 */
export function resolveItemTheme(item) {
  return resolveInterfaceTheme(item);
}

/**
 * Classe de contexte destinée aux surfaces ApplicationV2/DialogV2.
 */
export function interfaceThemeClass(theme = DEFAULT_INTERFACE_THEME) {
  return `interface-theme--${normalizeInterfaceTheme(theme)}`;
}
