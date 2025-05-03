import { ReactiveQuery } from './types';

export const isReactiveQuery = <
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveQuery: unknown,
): maybeReactiveQuery is ReactiveQuery<
  TParams,
  TResult,
  E,
  TNativeOptions,
  TNativeReturnType
> => {
  return (
    (typeof maybeReactiveQuery === 'function' ||
      typeof maybeReactiveQuery === 'object') &&
    maybeReactiveQuery !== null &&
    'useQuery' in maybeReactiveQuery &&
    typeof (
      maybeReactiveQuery as ReactiveQuery<
        TParams,
        TResult,
        E,
        TNativeOptions,
        TNativeReturnType
      >
    ).useQuery === 'function'
  );
};
