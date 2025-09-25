export const isEligibleReactive = (maybeReactive: unknown) => {
  return (
    (typeof maybeReactive === 'function' ||
      typeof maybeReactive === 'object') &&
    maybeReactive !== null &&
    'use' in maybeReactive &&
    typeof (maybeReactive as { use: unknown }).use === 'function'
  );
};
