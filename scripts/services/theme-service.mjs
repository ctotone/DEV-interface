export const DEFAULT_INTERFACE_THEME = "default";

/**
 * Point d'extension commun aux feuilles et aux cartes de chat.
 * Aucun choix de thème n'est persisté en Phase 05.
 */
export function resolveActorTheme(_actor) {
  return DEFAULT_INTERFACE_THEME;
}
