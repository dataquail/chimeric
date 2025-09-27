import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveInfiniteQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

export function createReactiveInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TNativeOptions,
    TNativeReturnType
  >['use'],
): ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TNativeOptions, TNativeReturnType> {
  const reactiveInfiniteQuery = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveInfiniteQuery)) {
    return markReactive(
      reactiveInfiniteQuery,
      TYPE_MARKERS.REACTIVE_INFINITE_QUERY,
    ) as ReactiveInfiniteQuery<
      TParams,
      TPageData,
      TPageParam,
      TError,
      TNativeOptions,
      TNativeReturnType
    >;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive infinite query');
  }
}