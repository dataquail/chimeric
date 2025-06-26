import { isIdiomaticMutation } from './isIdiomaticMutation';
import { IdiomaticMutation } from './types';

export function createIdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticMutation<TParams, TResult, TNativeOptions>,
): IdiomaticMutation<TParams, TResult, TNativeOptions> {
  if (isIdiomaticMutation<TParams, TResult, TNativeOptions>(idiomaticFn)) {
    return idiomaticFn;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic mutation');
  }
}
