import { ReactiveInfiniteQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

export const isReactiveInfiniteQuery = <
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  maybeReactiveInfiniteQuery: unknown,
): maybeReactiveInfiniteQuery is ReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TNativeOptions,
  TNativeReturnType
> => {
  return (
    isEligibleReactive(maybeReactiveInfiniteQuery) &&
    hasReactiveMarker(maybeReactiveInfiniteQuery, TYPE_MARKERS.REACTIVE_INFINITE_QUERY)
  );
};