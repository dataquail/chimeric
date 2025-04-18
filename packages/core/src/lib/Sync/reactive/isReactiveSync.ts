import { ReactiveSync } from './types';

export const isReactiveSync = <TParams = undefined, TResult = unknown>(
  maybeReactiveSync: unknown,
): maybeReactiveSync is ReactiveSync<TParams, TResult> => {
  return (
    (typeof maybeReactiveSync === 'function' ||
      typeof maybeReactiveSync === 'object') &&
    maybeReactiveSync !== null &&
    'useSync' in maybeReactiveSync &&
    typeof (maybeReactiveSync as ReactiveSync<TParams, TResult>).useSync ===
      'function'
  );
};
