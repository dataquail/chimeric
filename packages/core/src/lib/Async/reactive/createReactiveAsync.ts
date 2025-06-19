import { isReactiveAsync } from './isReactiveAsync';
import { ReactiveAsync } from './types';

export function createReactiveAsync<TParams, TResult, E extends Error = Error>(
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
