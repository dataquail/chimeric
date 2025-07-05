import { ReactiveMutation } from './types';

export const isReactiveMutation = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveMutation: unknown,
): maybeReactiveMutation is ReactiveMutation<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeInvokeOptions,
  TNativeReturnType
> => {
  return (
    (typeof maybeReactiveMutation === 'function' ||
      typeof maybeReactiveMutation === 'object') &&
    maybeReactiveMutation !== null &&
    'use' in maybeReactiveMutation &&
    typeof (
      maybeReactiveMutation as ReactiveMutation<
        TParams,
        TResult,
        TError,
        TNativeOptions,
        TNativeInvokeOptions,
        TNativeReturnType
      >
    ).use === 'function'
  );
};
