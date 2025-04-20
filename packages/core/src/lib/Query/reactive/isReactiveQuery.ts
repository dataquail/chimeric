import { ReactiveQuery } from './types';

export const isReactiveQuery = <
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveQuery: unknown,
): maybeReactiveQuery is ReactiveQuery<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveQuery === 'function' ||
      typeof maybeReactiveQuery === 'object') &&
    maybeReactiveQuery !== null &&
    'useQuery' in maybeReactiveQuery &&
    typeof (maybeReactiveQuery as ReactiveQuery<TParams, TResult, E>)
      .useQuery === 'function'
  );
};
