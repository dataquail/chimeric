import { isIdiomaticAsync } from './isIdiomaticAsync';
import { IdiomaticAsync } from './types';

// Overloads
export function createIdiomaticAsync<TResult = unknown>(
  idiomaticFn: () => Promise<TResult>,
): IdiomaticAsync<void, TResult>;
export function createIdiomaticAsync<TParams extends object, TResult = unknown>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult>;

// Implementation
export function createIdiomaticAsync<
  TParams extends void | object,
  TResult = unknown,
>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticAsync<TParams, TResult> {
  if (isIdiomaticAsync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic async');
  }
}
