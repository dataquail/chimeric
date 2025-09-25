import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveEagerAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

export function createReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: ReactiveEagerAsync<TParams, TResult, E>['use'],
): ReactiveEagerAsync<TParams, TResult, E> {
  const reactiveEagerAsync = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveEagerAsync)) {
    return markReactive(
      reactiveEagerAsync,
      TYPE_MARKERS.REACTIVE_EAGER_ASYNC,
    ) as ReactiveEagerAsync<TParams, TResult, E>;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive eager async');
  }
}
