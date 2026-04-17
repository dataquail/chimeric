import {
  FetchQueryOptions,
  QueryKey,
  type QueryClient,
} from '@tanstack/vue-query';
import { createIdiomaticQuery } from '@chimeric/core';
import { IdiomaticQuery, TanstackQueryIdiomaticNativeOptions } from './types';
import { IdiomaticQueryOptions, validateMaxArgLength } from '@chimeric/core';

// Required params (must come first - most specific)
export function IdiomaticQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params: TParams,
  ) => FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
}): IdiomaticQuery<TParams, TResult, TError, TQueryKey>;

// Optional params
export function IdiomaticQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params?: TParams,
  ) => FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
}): IdiomaticQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params
export function IdiomaticQueryFactory<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: () => FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
}): IdiomaticQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function IdiomaticQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getQueryOptions,
}: {
  queryClient: QueryClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getQueryOptions: any;
}): IdiomaticQuery<TParams, TResult, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getQueryOptions,
    fnName: 'getQueryOptions',
    maximumLength: 1,
  });

  const idiomaticQuery = async (
    paramsOrOptions?: Parameters<
      IdiomaticQuery<TParams, TResult, TError, TQueryKey>
    >[0],
    maybeOptions?: Parameters<
      IdiomaticQuery<TParams, TResult, TError, TQueryKey>
    >[1],
  ) => {
    const params =
      getQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getQueryOptions.length === 0
        ? (paramsOrOptions as {
            options?: IdiomaticQueryOptions;
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              TResult,
              TError
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | TanstackQueryIdiomaticNativeOptions<TResult, TError>
      | undefined;

    let fetchQueryOptions: FetchQueryOptions<
      TResult,
      TError,
      TResult,
      TQueryKey
    > = getQueryOptions(params);

    if (allOptions?.options?.forceRefetch) {
      fetchQueryOptions.staleTime = 0;
    }

    if (nativeOptions) {
      fetchQueryOptions = {
        ...fetchQueryOptions,
        ...nativeOptions,
      } as FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
    }

    return queryClient.fetchQuery(fetchQueryOptions);
  };

  const prefetch = async (
    paramsOrOptions?: Parameters<
      IdiomaticQuery<TParams, TResult, TError, TQueryKey>['prefetch']
    >[0],
    maybeOptions?: Parameters<
      IdiomaticQuery<TParams, TResult, TError, TQueryKey>['prefetch']
    >[1],
  ) => {
    const params =
      getQueryOptions.length === 0
        ? (undefined as TParams)
        : (paramsOrOptions as TParams);
    const allOptions =
      getQueryOptions.length === 0
        ? (paramsOrOptions as {
            nativeOptions?: TanstackQueryIdiomaticNativeOptions<
              TResult,
              TError
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | TanstackQueryIdiomaticNativeOptions<TResult, TError>
      | undefined;

    let prefetchQueryOptions: FetchQueryOptions<
      TResult,
      TError,
      TResult,
      TQueryKey
    > = getQueryOptions(params);

    if (nativeOptions) {
      prefetchQueryOptions = {
        ...prefetchQueryOptions,
        ...nativeOptions,
      } as FetchQueryOptions<TResult, TError, TResult, TQueryKey>;
    }

    await queryClient.prefetchQuery(prefetchQueryOptions);
  };

  return createIdiomaticQuery(idiomaticQuery, prefetch) as IdiomaticQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
