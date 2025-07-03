import { ReactiveQuery } from './types';

export const isReactiveQuery = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveQuery: unknown,
): maybeReactiveQuery is ReactiveQuery<
  TParams,
  TResult,
  TError,
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
        TError,
        TNativeOptions,
        TNativeReturnType
      >
    ).useQuery === 'function'
  );
};
