import { isIdiomaticMutation } from './isIdiomaticMutation';
import { IdiomaticMutation } from './types';

// Overloads
export function createIdiomaticMutation<TResult = unknown>(
  idiomaticFn: () => Promise<TResult>,
): IdiomaticMutation<void, TResult>;
export function createIdiomaticMutation<
  TParams extends object,
  TResult = unknown,
>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticMutation<TParams, TResult>;

// Implementation
export function createIdiomaticMutation<
  TParams extends void | object,
  TResult = unknown,
>(
  idiomaticFn: (
    params: TParams,
  ) => ReturnType<IdiomaticMutation<TParams, TResult>>,
): IdiomaticMutation<TParams, TResult> {
  if (isIdiomaticMutation<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticMutation<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic mutation');
  }
}
