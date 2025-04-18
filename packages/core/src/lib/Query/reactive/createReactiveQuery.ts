import { ReactiveQuery } from './types';
import { isReactiveQuery } from './isReactiveQuery';

// Overloads
export function createReactiveQuery<TResult = unknown>(
  reactiveFn: () => ReturnType<ReactiveQuery<void, TResult>['useQuery']>,
): ReactiveQuery<void, TResult>;
export function createReactiveQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveQuery<TParams, TResult, E>['useQuery']>,
): ReactiveQuery<TParams, TResult, E>;

// Implementation
export function createReactiveQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (
    params: TParams,
  ) => ReturnType<ReactiveQuery<TParams, TResult, E>['useQuery']>,
): ReactiveQuery<TParams, TResult, E> {
  const reactiveQuery = {
    useQuery: reactiveFn,
  };
  if (isReactiveQuery<TParams, TResult, E>(reactiveQuery)) {
    return reactiveQuery;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive query');
  }
}
