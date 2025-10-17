import { IdiomaticInfiniteQuery } from './types';
import { isIdiomaticInfiniteQuery as coreIsIdiomaticInfiniteQuery } from '@chimeric/core';
import { QueryKey } from '@tanstack/react-query';

export const isIdiomaticInfiniteQuery = <
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  maybeIdiomaticInfiniteQuery: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >,
): maybeIdiomaticInfiniteQuery is IdiomaticInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
> => {
  return coreIsIdiomaticInfiniteQuery(maybeIdiomaticInfiniteQuery);
};
