import { IdiomaticInfiniteQuery } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { hasIdiomaticMarker } from '../../utilities/hasIdiomaticMarker';

export const isIdiomaticInfiniteQuery = <
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  maybeIdiomaticInfiniteQuery: unknown,
): maybeIdiomaticInfiniteQuery is IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions> => {
  return (
    isEligibleIdiomatic(maybeIdiomaticInfiniteQuery) &&
    hasIdiomaticMarker(
      maybeIdiomaticInfiniteQuery,
      TYPE_MARKERS.IDIOMATIC_INFINITE_QUERY,
    )
  );
};