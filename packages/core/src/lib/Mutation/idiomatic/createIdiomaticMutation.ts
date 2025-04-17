import { isIdiomaticMutation } from './isIdiomaticMutation';
import { IdiomaticMutation } from './types';

export const createIdiomaticMutation = <TParams = void, TResult = unknown>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticMutation<TParams, TResult>>,
): IdiomaticMutation<TParams, TResult> => {
  if (isIdiomaticMutation<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticMutation<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic mutation');
  }
};
