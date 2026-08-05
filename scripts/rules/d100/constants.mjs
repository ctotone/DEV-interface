export const D100_MODES = Object.freeze({
  NORMAL: "normal",
  ADVANTAGE: "advantage",
  DISADVANTAGE: "disadvantage"
});

export const D100_QUALITIES = Object.freeze({
  SUPER_SUCCESS: "super-success",
  CRITICAL_SUCCESS: "critical-success",
  SUCCESS: "success",
  FAILURE: "failure",
  CRITICAL_FAILURE: "critical-failure",
  SUPER_FAILURE: "super-failure"
});

export const D100_QUALITY_RANKS = Object.freeze({
  [D100_QUALITIES.SUPER_SUCCESS]: 5,
  [D100_QUALITIES.CRITICAL_SUCCESS]: 4,
  [D100_QUALITIES.SUCCESS]: 3,
  [D100_QUALITIES.FAILURE]: 2,
  [D100_QUALITIES.CRITICAL_FAILURE]: 1,
  [D100_QUALITIES.SUPER_FAILURE]: 0
});

export function isD100Mode(value) {
  return Object.values(D100_MODES).includes(value);
}
