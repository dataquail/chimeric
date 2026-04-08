import type {
  ApiEndpointInfiniteQuery,
  InfiniteQueryDefinition,
  EndpointDefinitions,
  InfiniteQueryArgFrom,
  ResultTypeFrom,
  PageParamFrom,
  Api,
  BaseQueryFn,
  PrefetchOptions,
  SubscriptionOptions,
} from '@reduxjs/toolkit/query';
import {
  createReactiveInfiniteQuery,
  ReactiveInfiniteQueryOptions,
} from '@chimeric/core';
import { wrapRtkError } from '../../utilities/wrapRtkError';
import { isChimericAllOptions } from '../../utilities/isChimericAllOptions';
import { ReactiveInfiniteQuery } from './types';

type InfiniteQueryEndpointWithHooks = {
  useInfiniteQuery: (arg: any, options?: any) => any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiWithUsePrefetch = { usePrefetch: (...args: any[]) => any };

export function ReactiveInfiniteQueryFactory<
  D extends InfiniteQueryDefinition<any, any, any, any, any>,
  Definitions extends EndpointDefinitions,
  ReducerPath extends string = string,
  TagTypes extends string = string,
  TError extends Error = Error,
>({
  endpoint,
  endpointName,
  api,
}: {
  endpoint: ApiEndpointInfiniteQuery<D, Definitions> &
    InfiniteQueryEndpointWithHooks;
  endpointName: string;
  api: Api<BaseQueryFn, Definitions, ReducerPath, TagTypes> & ApiWithUsePrefetch;
}): ReactiveInfiniteQuery<
  InfiniteQueryArgFrom<D>,
  ResultTypeFrom<D>,
  PageParamFrom<D>,
  TError
> {
  const query = (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const firstIsOptions = second === undefined && isChimericAllOptions(first);
    const params = firstIsOptions ? (undefined as InfiniteQueryArgFrom<D>) : (first as InfiniteQueryArgFrom<D>);
    const allOptions = (firstIsOptions ? first : second) as
      | {
          options?: ReactiveInfiniteQueryOptions;
          nativeOptions?: SubscriptionOptions & Record<string, unknown>;
        }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    const hookOptions = {
      ...(allOptions?.options?.enabled === false ? { skip: true } : {}),
      ...(nativeOptions ?? {}),
    };

    const result = endpoint.useInfiniteQuery(params, hookOptions);

    return {
      isIdle: result.isUninitialized,
      isPending: result.isLoading,
      isSuccess: result.isSuccess,
      isError: result.isError,
      error: result.error ? (wrapRtkError(result.error) as TError) : null,
      data: result.data
        ? {
            pages: result.data.pages as ResultTypeFrom<D>[],
            pageParams: result.data.pageParams as PageParamFrom<D>[],
          }
        : undefined,
      isFetchingNextPage: result.isFetchingNextPage ?? false,
      isFetchingPreviousPage: result.isFetchingPreviousPage ?? false,
      hasNextPage: result.hasNextPage ?? false,
      hasPreviousPage: result.hasPreviousPage ?? false,
      fetchNextPage: async () => {
        const fetched = await result.fetchNextPage();
        return {
          pages: (fetched?.data?.pages ?? []) as ResultTypeFrom<D>[],
          pageParams: (fetched?.data?.pageParams ?? []) as PageParamFrom<D>[],
        };
      },
      fetchPreviousPage: async () => {
        const fetched = await result.fetchPreviousPage();
        return {
          pages: (fetched?.data?.pages ?? []) as ResultTypeFrom<D>[],
          pageParams: (fetched?.data?.pageParams ?? []) as PageParamFrom<D>[],
        };
      },
      refetch: async () => {
        const refetched = await result.refetch();
        return {
          pages: (refetched?.data?.pages ?? []) as ResultTypeFrom<D>[],
          pageParams:
            (refetched?.data?.pageParams ?? []) as PageParamFrom<D>[],
        };
      },
      native: result,
    };
  };

  const prefetchHook = (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const firstIsOptions = second === undefined && isChimericAllOptions(first);
    const params = firstIsOptions ? (undefined as InfiniteQueryArgFrom<D>) : (first as InfiniteQueryArgFrom<D>);
    const allOptions = (firstIsOptions ? first : second) as
      | { nativeOptions?: PrefetchOptions }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    const prefetch = api.usePrefetch(endpointName, nativeOptions);
    prefetch(params);
  };

  return createReactiveInfiniteQuery(
    query,
    prefetchHook,
  ) as ReactiveInfiniteQuery<
    InfiniteQueryArgFrom<D>,
    ResultTypeFrom<D>,
    PageParamFrom<D>,
    TError
  >;
}
