import { isReactiveAsync } from './isReactiveAsync';
import { ReactiveAsync } from './types';

export function createReactiveAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveAsync<TParams, TResult, TError>['use'],
): ReactiveAsync<TParams, TResult, TError> {
  const reactiveAsync = {
    use: reactiveFn,
  };
  if (isReactiveAsync<TParams, TResult, TError>(reactiveAsync)) {
    return reactiveAsync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive async');
  }
}
