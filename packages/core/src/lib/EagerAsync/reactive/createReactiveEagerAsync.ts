import { isReactiveEagerAsync } from './isReactiveEagerAsync';
import { ReactiveEagerAsync } from './types';

export function createReactiveEagerAsync<
  TParams,
  TResult,
  E extends Error = Error,
>(
  reactiveFn: ReactiveEagerAsync<TParams, TResult, E>['useEagerAsync'],
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
