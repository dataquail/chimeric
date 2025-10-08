import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveEagerAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

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
    return markReactive(reactiveEagerAsync, TYPE_MARKERS.REACTIVE_EAGER_ASYNC);
  } else {
    throw new Error('reactiveFn is not qualified to be reactive eager async');
  }
}
