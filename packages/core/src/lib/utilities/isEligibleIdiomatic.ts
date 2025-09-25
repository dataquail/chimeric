export const isEligibleIdiomatic = (maybeIdiomatic: unknown) => {
  return typeof maybeIdiomatic === 'function';
};
