import { ReactiveSync } from './types';

export const isReactiveSync = <TParams = void, TResult = unknown>(
  maybeReactiveSync: unknown,
): maybeReactiveSync is ReactiveSync<TParams, TResult> => {
  return (
    (typeof maybeReactiveSync === 'function' ||
      typeof maybeReactiveSync === 'object') &&
    maybeReactiveSync !== null &&
    'use' in maybeReactiveSync &&
    typeof (maybeReactiveSync as ReactiveSync<TParams, TResult>).use ===
      'function'
  );
};
