import { IdiomaticInfiniteQuery, IdiomaticInfiniteQueryOptions } from '@chimeric/core';
import {
  QueryKey,
  TanstackInfiniteQueryIdiomaticNativeOptions,
} from '@chimeric/react-query';
import { IdiomaticInfiniteQueryTestHarness as CoreIdiomaticInfiniteQueryTestHarness } from '@chimeric/testing-core';
import { IdiomaticInfiniteQueryTestHarnessReturnType } from './types.js';

export function IdiomaticInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  args: TParams extends void
    ? {
        idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TanstackInfiniteQueryIdiomaticNativeOptions<
            TPageData,
            TError,
            TPageParam,
            TQueryKey
          >
        >;
        options?: IdiomaticInfiniteQueryOptions<TPageParam>;
        nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >;
      }
    : {
        idiomaticInfiniteQuery: IdiomaticInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TanstackInfiniteQueryIdiomaticNativeOptions<
            TPageData,
            TError,
            TPageParam,
            TQueryKey
          >
        >;
        params: TParams;
        options?: IdiomaticInfiniteQueryOptions<TPageParam>;
        nativeOptions?: TanstackInfiniteQueryIdiomaticNativeOptions<
          TPageData,
          TError,
          TPageParam,
          TQueryKey
        >;
      },
): IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError> {
  return CoreIdiomaticInfiniteQueryTestHarness(args as any) as IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError>;
}