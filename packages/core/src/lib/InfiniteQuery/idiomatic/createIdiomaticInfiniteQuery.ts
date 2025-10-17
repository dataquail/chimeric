import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticInfiniteQuery } from './types';

// No params
export function createIdiomaticInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TNativeOptions
  >,
): IdiomaticInfiniteQuery<void, TPageData, TPageParam, TNativeOptions>;

// Optional params
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TNativeOptions
  >,
): IdiomaticInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TNativeOptions
>;

// Required params
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TNativeOptions
  >,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions>;

// Implementation
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TNativeOptions
  >,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    return markIdiomatic(
      idiomaticFn,
      TYPE_MARKERS.IDIOMATIC_INFINITE_QUERY,
    ) as IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions>;
  } else {
    throw new Error(
      'idiomaticFn is not qualified to be idiomatic infinite query',
    );
  }
}
