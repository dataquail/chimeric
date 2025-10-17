import { ChimericInfiniteQuery } from './types';
import { isChimericInfiniteQuery as coreIsChimericInfiniteQuery } from '@chimeric/core';
import { QueryKey } from '@tanstack/react-query';

export const isChimericInfiniteQuery = <
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  maybeChimericInfiniteQuery: ChimericInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >,
): maybeChimericInfiniteQuery is ChimericInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
> => {
  return coreIsChimericInfiniteQuery(maybeChimericInfiniteQuery);
};
