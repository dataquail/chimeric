import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import {
  IdiomaticInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
  IdiomaticInfiniteQueryResult,
} from './types';

// No params
export function createIdiomaticInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (allOptions?: {
    options?: IdiomaticInfiniteQueryOptions<TPageParam>;
    nativeOptions?: TNativeOptions;
  }) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (allOptions?: {
    nativeOptions?: TNativeOptions;
  }) => Promise<void>,
): IdiomaticInfiniteQuery<void, TPageData, TPageParam, TNativeOptions>;

// Optional params
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params?: TParams,
    allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<void>,
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
  idiomaticFn: (
    params: TParams,
    allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<void>,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions>;

// Implementation
export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TNativeOptions = unknown,
>(
  idiomaticFn: (
    params: TParams,
    allOptions?: {
      options?: IdiomaticInfiniteQueryOptions<TPageParam>;
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<IdiomaticInfiniteQueryResult<TPageData, TPageParam>>,
  prefetchFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TNativeOptions;
    },
  ) => Promise<void>,
): IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TNativeOptions> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    Object.assign(idiomaticFn, { prefetch: prefetchFn });
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
