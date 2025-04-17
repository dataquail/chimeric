import { isReactiveMutation } from './isReactiveMutation';
import { ReactiveMutation } from './types';

export const createReactiveMutation = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveMutation<TParams, TResult, E>['useMutation']>,
): ReactiveMutation<TParams, TResult, E> => {
  const reactiveMutation = {
    useMutation: reactiveFn,
  };
  if (isReactiveMutation<TParams, TResult, E>(reactiveMutation)) {
    return reactiveMutation;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
};
