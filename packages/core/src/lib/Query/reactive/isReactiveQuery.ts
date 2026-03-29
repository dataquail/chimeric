import { ReactiveQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { hasReactiveMarker } from '../../utilities/hasReactiveMarker';

const hasUsePrefetchHook = (maybeReactiveQuery: unknown): boolean => {
  return (
    (typeof maybeReactiveQuery === 'function' ||
      typeof maybeReactiveQuery === 'object') &&
    maybeReactiveQuery !== null &&
    'usePrefetchHook' in maybeReactiveQuery &&
    typeof (maybeReactiveQuery as { usePrefetchHook: unknown })
      .usePrefetchHook === 'function'
  );
};

export const isReactiveQuery = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
>(
  maybeReactiveQuery: unknown,
): maybeReactiveQuery is ReactiveQuery<
  TParams,
  TResult,
  TError,
  TNativeOptions,
  TNativeReturnType,
  TNativePrefetchOptions
> => {
  return (
    isEligibleReactive(maybeReactiveQuery) &&
    hasUsePrefetchHook(maybeReactiveQuery) &&
    hasReactiveMarker(maybeReactiveQuery, TYPE_MARKERS.REACTIVE_QUERY)
  );
};
