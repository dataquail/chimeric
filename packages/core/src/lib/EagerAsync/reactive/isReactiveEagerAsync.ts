import { ReactiveEagerAsync } from './types';

export const isReactiveEagerAsync = <
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveEagerAsync<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveAsync === 'function' ||
      typeof maybeReactiveAsync === 'object') &&
    maybeReactiveAsync !== null &&
    'useEagerAsync' in maybeReactiveAsync &&
    typeof (maybeReactiveAsync as ReactiveEagerAsync<TParams, TResult, E>)
      .useEagerAsync === 'function'
  );
};
