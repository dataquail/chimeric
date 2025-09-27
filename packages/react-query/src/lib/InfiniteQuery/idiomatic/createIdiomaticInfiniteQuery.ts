import { IdiomaticInfiniteQuery } from './types';
import { QueryKey } from '@tanstack/react-query';
import { createIdiomaticInfiniteQuery as coreCreateIdiomaticInfiniteQuery } from '@chimeric/core';

export function createIdiomaticInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>,
): IdiomaticInfiniteQuery<
  TParams extends undefined ? void : TParams,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
> {
  return coreCreateIdiomaticInfiniteQuery(idiomaticFn) as IdiomaticInfiniteQuery<
    TParams extends undefined ? void : TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}