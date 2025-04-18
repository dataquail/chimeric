import { IdiomaticQuery } from './types';
import { isIdiomaticQuery } from './isIdiomaticQuery';

// Overloads
export function createIdiomaticQuery<TResult = unknown>(
  idiomaticFn: () => ReturnType<IdiomaticQuery<void, TResult>>,
): IdiomaticQuery<void, TResult>;
export function createIdiomaticQuery<TParams extends object, TResult = unknown>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticQuery<TParams, TResult>>,
): IdiomaticQuery<TParams, TResult>;

// Implementation
export function createIdiomaticQuery<
  TParams extends void | object,
  TResult = unknown,
>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticQuery<TParams, TResult>>,
): IdiomaticQuery<TParams, TResult> {
  if (isIdiomaticQuery<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic query');
  }
}
