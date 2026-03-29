import { ReactiveInfiniteQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

const hasUsePrefetchHook = (maybeReactiveInfiniteQuery: unknown): boolean => {
  return (
    (typeof maybeReactiveInfiniteQuery === 'function' ||
      typeof maybeReactiveInfiniteQuery === 'object') &&
    maybeReactiveInfiniteQuery !== null &&
    'usePrefetchHook' in maybeReactiveInfiniteQuery &&
    typeof (maybeReactiveInfiniteQuery as { usePrefetchHook: unknown })
      .usePrefetchHook === 'function'
  );
};

export const isReactiveInfiniteQuery = <
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  maybeReactiveInfiniteQuery: unknown,
): maybeReactiveInfiniteQuery is ReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
> => {
  return (
    isEligibleReactive(maybeReactiveInfiniteQuery) &&
    hasUsePrefetchHook(maybeReactiveInfiniteQuery) &&
    hasReactiveMarker(
      maybeReactiveInfiniteQuery,
      TYPE_MARKERS.REACTIVE_INFINITE_QUERY,
    )
  );
};
