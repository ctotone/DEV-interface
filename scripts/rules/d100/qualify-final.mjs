import { qualifyNatural } from "./qualify-natural.mjs";

export function qualifyFinalResult({ finalResult, finalThreshold }) {
  return qualifyNatural(finalResult, finalThreshold);
}
