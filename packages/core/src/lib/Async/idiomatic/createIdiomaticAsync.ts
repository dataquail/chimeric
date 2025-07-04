import { isIdiomaticAsync } from './isIdiomaticAsync';
import { IdiomaticAsync } from './types';

export function createIdiomaticAsync<TParams = void, TResult = unknown>(
  idiomaticFn: IdiomaticAsync<TParams, TResult>,
): IdiomaticAsync<TParams, TResult> {
  if (isIdiomaticAsync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic async');
  }
}
