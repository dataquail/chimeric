import { fuseChimericInfiniteQuery as coreFuseChimericInfiniteQuery } from '@chimeric/core';
import { ChimericInfiniteQuery } from './types';
import { IdiomaticInfiniteQuery } from '../idiomatic/types';
import { ReactiveInfiniteQuery } from '../reactive/types';
import { QueryKey } from '@tanstack/react-query';

export function fuseChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;
  reactive: ReactiveInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;
}): ChimericInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  return coreFuseChimericInfiniteQuery(args);
}