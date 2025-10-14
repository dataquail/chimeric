import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveEagerAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

// No params
export function createReactiveEagerAsync<
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveEagerAsync<void, TResult, TError>['use'],
): ReactiveEagerAsync<void, TResult, TError>;

// Optional params
export function createReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveEagerAsync<TParams | undefined, TResult, TError>['use'],
): ReactiveEagerAsync<TParams | undefined, TResult, TError>;

// Required params
export function createReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveEagerAsync<TParams, TResult, TError>['use'],
): ReactiveEagerAsync<TParams, TResult, TError>;

// Implementation
export function createReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveFn: ReactiveEagerAsync<TParams, TResult, TError>['use'],
): ReactiveEagerAsync<TParams, TResult, TError> {
  const reactiveEagerAsync = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveEagerAsync)) {
    return markReactive(
      reactiveEagerAsync,
      TYPE_MARKERS.REACTIVE_EAGER_ASYNC,
    ) as ReactiveEagerAsync<TParams, TResult, TError>;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive eager async');
  }
}
