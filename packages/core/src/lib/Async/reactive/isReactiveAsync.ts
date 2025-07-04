import { ReactiveAsync } from './types';

export const isReactiveAsync = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveAsync<TParams, TResult, TError> => {
  return (
    (typeof maybeReactiveAsync === 'function' ||
      typeof maybeReactiveAsync === 'object') &&
    maybeReactiveAsync !== null &&
    'useAsync' in maybeReactiveAsync &&
    typeof (maybeReactiveAsync as ReactiveAsync<TParams, TResult, TError>)
      .useAsync === 'function'
  );
};
