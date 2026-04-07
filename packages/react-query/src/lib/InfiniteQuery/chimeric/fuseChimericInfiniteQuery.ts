import { fuseChimericInfiniteQuery as coreFuseChimericInfiniteQuery } from '@chimeric/core';
import { ChimericInfiniteQuery } from './types';
import { IdiomaticInfiniteQuery } from '../idiomatic/types';
import { ReactiveInfiniteQuery } from '../reactive/types';
import { QueryKey } from '@tanstack/react-query';

// No params
export function fuseChimericInfiniteQuery<
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
  reactive: ReactiveInfiniteQuery<
    void,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}): ChimericInfiniteQuery<void, TPageData, TPageParam, TError, TQueryKey>;

// Optional params
export function fuseChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
  reactive: ReactiveInfiniteQuery<
    TParams | undefined,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}): ChimericInfiniteQuery<
  TParams | undefined,
  TPageData,
  TPageParam,
  TError,
  TQueryKey
>;

// Required params
export function fuseChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
  reactive: ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}): ChimericInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey>;

// Implementation
export function fuseChimericInfiniteQuery<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomatic: IdiomaticInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
  reactive: ReactiveInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;
}): ChimericInfiniteQuery<TParams, TPageData, TPageParam, TError, TQueryKey> {
  const chimeric = coreFuseChimericInfiniteQuery(args) as ChimericInfiniteQuery<
    TParams,
    TPageData,
    TPageParam,
    TError,
    TQueryKey
  >;

  if (args.reactive.useSuspenseHook) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (chimeric as any).useSuspenseHook = args.reactive.useSuspenseHook;
  }

  return chimeric;
}
