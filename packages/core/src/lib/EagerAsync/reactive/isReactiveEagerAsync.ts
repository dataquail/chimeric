import { ReactiveEagerAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

export const isReactiveEagerAsync = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveAsync: ReactiveEagerAsync<TParams, TResult, E>,
): maybeReactiveAsync is ReactiveEagerAsync<TParams, TResult, E> => {
  return (
    isEligibleReactive(maybeReactiveAsync) &&
    hasReactiveMarker(maybeReactiveAsync, TYPE_MARKERS.REACTIVE_EAGER_ASYNC)
  );
};
