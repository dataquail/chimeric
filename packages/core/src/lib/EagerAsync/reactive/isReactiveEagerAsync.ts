import { ReactiveEagerAsync } from './types';

export const isReactiveEagerAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveEagerAsync<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveAsync === 'function' ||
      typeof maybeReactiveAsync === 'object') &&
    maybeReactiveAsync !== null &&
    'use' in maybeReactiveAsync &&
    typeof (maybeReactiveAsync as ReactiveEagerAsync<TParams, TResult, E>)
      .use === 'function'
  );
};
