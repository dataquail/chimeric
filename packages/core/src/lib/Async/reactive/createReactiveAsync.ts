import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

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
  if (isEligibleReactive(reactiveAsync)) {
    return markReactive(
      reactiveAsync,
      TYPE_MARKERS.REACTIVE_ASYNC,
    ) as ReactiveAsync<TParams, TResult, TError>;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive async');
  }
}
