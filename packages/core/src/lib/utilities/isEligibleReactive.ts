export const isEligibleReactive = (maybeReactive: unknown) => {
  return (
    (typeof maybeReactive === 'function' ||
      typeof maybeReactive === 'object') &&
    maybeReactive !== null &&
    'useHook' in maybeReactive &&
    typeof (maybeReactive as { useHook: unknown }).useHook === 'function'
  );
};
