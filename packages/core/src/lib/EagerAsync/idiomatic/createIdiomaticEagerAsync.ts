import { isIdiomaticEagerAsync } from './isIdiomaticEagerAsync';
import { IdiomaticEagerAsync } from './types';

export function createIdiomaticEagerAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticEagerAsync<TParams, TResult> {
  if (isIdiomaticEagerAsync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticEagerAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic eager async');
  }
}
