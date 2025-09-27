import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticInfiniteQuery } from './types';

export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (params: TParams, options?: TNativeOptions) => Promise<{ pages: TPageData[]; pageParams: TPageParam[] }>,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    return markIdiomatic(
      idiomaticFn,
      TYPE_MARKERS.IDIOMATIC_INFINITE_QUERY,
    ) as IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic infinite query');
  }
}