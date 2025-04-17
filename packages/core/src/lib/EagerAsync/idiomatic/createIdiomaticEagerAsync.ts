import { isIdiomaticEagerAsync } from './isIdiomaticEagerAsync';
import { IdiomaticEagerAsync } from './types';

// Overloads
export function createIdiomaticEagerAsync<
  TParams extends void,
  TResult = unknown,
>(idiomaticFn: () => Promise<TResult>): IdiomaticEagerAsync<void, TResult>;
export function createIdiomaticEagerAsync<
  TParams extends object,
  TResult = unknown,
>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticEagerAsync<TParams, TResult>;

// Implementation
export function createIdiomaticEagerAsync<
  TParams extends void | object,
  TResult = unknown,
>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticEagerAsync<TParams, TResult> {
  if (isIdiomaticEagerAsync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticEagerAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic eager async');
  }
}
