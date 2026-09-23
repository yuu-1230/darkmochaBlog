/** Wait for consecutive unchanged geometry samples, not just font readiness. */
export function layoutSettled(stableFrames = 3, maxFrames = 120) {
  let previous: string | undefined, stable = 0, attempts = 0;
  return (signature: string) => {
    stable = signature === previous ? stable + 1 : 0;
    previous = signature;
    return ++attempts >= maxFrames || stable >= stableFrames;
  };
}
