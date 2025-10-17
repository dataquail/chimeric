import { ReactiveInfiniteQuery } from './types';
import { isReactiveInfiniteQuery as coreIsReactiveInfiniteQuery } from '@chimeric/core';
import { QueryKey } from '@tanstack/react-query';

export const isReactiveInfiniteQuery = <
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  maybeReactiveInfiniteQuery: ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >,
): maybeReactiveInfiniteQuery is ReactiveInfiniteQuery<
  TParams,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
> => {
  return coreIsReactiveInfiniteQuery(maybeReactiveInfiniteQuery);
};
