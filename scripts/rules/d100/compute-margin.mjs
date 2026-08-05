export function computeMargin({
  finalThreshold,
  finalResult,
  success
}) {
  const difference = success
    ? finalThreshold - finalResult
    : finalResult - finalThreshold;

  return Object.freeze({
    kind: success ? "success" : "failure",
    value: Math.max(0, Math.floor(difference / 10))
  });
}
