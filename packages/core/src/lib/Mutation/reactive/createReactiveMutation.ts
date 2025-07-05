import { isReactiveMutation } from './isReactiveMutation';
import { ReactiveMutation } from './types';

export function createReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    TParams,
    TResult,
    TError,
    TNativeOptions,
    TNativeInvokeOptions,
    TNativeReturnType
  >['use'],
): ReactiveMutation<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeInvokeOptions,
  TNativeReturnType
> {
  const reactiveMutation = {
    use: reactiveFn,
  };
  if (
    isReactiveMutation<
      TParams,
      TResult,
      TError,
      TNativeOptions,
      TNativeInvokeOptions,
      TNativeReturnType
    >(reactiveMutation)
  ) {
    return reactiveMutation;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
}
