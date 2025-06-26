import { isReactiveMutation } from './isReactiveMutation';
import { ReactiveMutation } from './types';

export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeCallOptions,
    TNativeReturnType
  >['useMutation'],
): ReactiveMutation<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeCallOptions,
  TNativeReturnType
> {
  const reactiveMutation = {
    useMutation: reactiveFn,
  };
  if (
    isReactiveMutation<
      TParams,
      TResult,
      TError,
      TNativeOptions,
      TNativeCallOptions,
      TNativeReturnType
    >(reactiveMutation)
  ) {
    return reactiveMutation;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
}
