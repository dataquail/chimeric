import { isReactiveEagerAsync } from './isReactiveEagerAsync';
import { ReactiveEagerAsync } from './types';

// Overloads
export function createReactiveEagerAsync<
  TParams extends void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: () => ReturnType<
    ReactiveEagerAsync<void, TResult, E>['useEagerAsync']
  >,
): ReactiveEagerAsync<void, TResult, E>;
export function createReactiveEagerAsync<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveEagerAsync<TParams, TResult, E>['useEagerAsync']>,
): ReactiveEagerAsync<TParams, TResult, E>;

// Implementation
export function createReactiveEagerAsync<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveEagerAsync<TParams, TResult, E>['useEagerAsync']>,
): ReactiveEagerAsync<TParams, TResult, E> {
  const reactiveEagerAsync = {
    useEagerAsync: reactiveFn,
  };
  if (isReactiveEagerAsync<TParams, TResult, E>(reactiveEagerAsync)) {
    return reactiveEagerAsync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive eager async');
  }
}
