import { isReactiveAsync } from './isReactiveAsync';
import { ReactiveAsync } from './types';

// Overloads
export function createReactiveAsync<
  TParams extends void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: ReactiveAsync<void, TResult, E>['useAsync'],
): ReactiveAsync<void, TResult, E>;
export function createReactiveAsync<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: ReactiveAsync<TParams, TResult, E>['useAsync'],
): ReactiveAsync<TParams, TResult, E>;

// Implementation
export function createReactiveAsync<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: ReactiveAsync<TParams, TResult, E>['useAsync'],
): ReactiveAsync<TParams, TResult, E> {
  const reactiveAsync = {
    useAsync: reactiveFn,
  };
  if (isReactiveAsync<TParams, TResult, E>(reactiveAsync)) {
    return reactiveAsync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive async');
  }
}
