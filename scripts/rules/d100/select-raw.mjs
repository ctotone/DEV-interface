import { D100_MODES, isD100Mode } from "./constants.mjs";

export function selectRawResult(naturalResults, mode) {
  if (!Array.isArray(naturalResults)) {
    throw new TypeError("Les résultats naturels doivent être fournis dans un tableau.");
  }
  if (!isD100Mode(mode)) {
    throw new RangeError(`Mode D100 inconnu : ${mode}`);
  }

  const expected = mode === D100_MODES.NORMAL ? 1 : 2;
  if (naturalResults.length !== expected) {
    throw new RangeError(
      `Le mode ${mode} exige ${expected} résultat(s) naturel(s).`
    );
  }

  if (mode === D100_MODES.NORMAL) {
    return Object.freeze({
      selectedIndex: 0,
      selected: naturalResults[0]
    });
  }

  const direction = mode === D100_MODES.ADVANTAGE ? 1 : -1;
  let selectedIndex = 0;

  for (let index = 1; index < naturalResults.length; index += 1) {
    const current = naturalResults[selectedIndex];
    const candidate = naturalResults[index];
    const rankDifference = candidate.rank - current.rank;

    if (rankDifference * direction > 0) {
      selectedIndex = index;
      continue;
    }

    if (rankDifference !== 0) continue;

    const candidatePreferred = mode === D100_MODES.ADVANTAGE
      ? candidate.value < current.value
      : candidate.value > current.value;

    if (candidatePreferred) selectedIndex = index;
  }

  return Object.freeze({
    selectedIndex,
    selected: naturalResults[selectedIndex]
  });
}
