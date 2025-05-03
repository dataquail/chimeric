import { ReactiveMutation } from './types';

export const isReactiveMutation = <
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveMutation: unknown,
): maybeReactiveMutation is ReactiveMutation<
  TParams,
  TResult,
  E,
  TNativeOptions,
  TNativeCallOptions,
  TNativeReturnType
> => {
  return (
    (typeof maybeReactiveMutation === 'function' ||
      typeof maybeReactiveMutation === 'object') &&
    maybeReactiveMutation !== null &&
    'useMutation' in maybeReactiveMutation &&
    typeof (
      maybeReactiveMutation as ReactiveMutation<
        TParams,
        TResult,
        E,
        TNativeOptions,
        TNativeCallOptions,
        TNativeReturnType
      >
    ).useMutation === 'function'
  );
};
