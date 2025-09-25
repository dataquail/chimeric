import { ReactiveQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

export const isReactiveQuery = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveQuery: unknown,
): maybeReactiveQuery is ReactiveQuery<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeReturnType
> => {
  return (
    isEligibleReactive(maybeReactiveQuery) &&
    hasReactiveMarker(maybeReactiveQuery, TYPE_MARKERS.REACTIVE_QUERY)
  );
};
