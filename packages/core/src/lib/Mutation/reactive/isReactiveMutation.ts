import { ReactiveMutation } from './types';

export const isReactiveMutation = <
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveMutation: unknown,
): maybeReactiveMutation is ReactiveMutation<
  TParams,
  TResult,
  E,
  TNativeOptions,
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
        TNativeReturnType
      >
    ).useMutation === 'function'
  );
};
