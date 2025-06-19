import { ReactiveAsync } from './types';

export const isReactiveAsync = <TParams, TResult, E extends Error = Error>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveAsync<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveAsync === 'function' ||
      typeof maybeReactiveAsync === 'object') &&
    maybeReactiveAsync !== null &&
    'useAsync' in maybeReactiveAsync &&
    typeof (maybeReactiveAsync as ReactiveAsync<TParams, TResult, E>)
      .useAsync === 'function'
  );
};
