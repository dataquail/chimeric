import { ReactiveAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

export const isReactiveAsync = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  maybeReactiveAsync: unknown,
): maybeReactiveAsync is ReactiveAsync<TParams, TResult, TError> => {
  return (
    isEligibleReactive(maybeReactiveAsync) &&
    hasReactiveMarker(maybeReactiveAsync, TYPE_MARKERS.REACTIVE_ASYNC)
  );
};
