import {
  FetchQueryOptions,
  QueryKey,
  queryOptions,
  type QueryClient,
} from '@tanstack/react-query';
import { createIdiomaticQuery } from './createIdiomaticQuery';
import { IdiomaticQuery, TanstackQueryIdiomaticNativeOptions } from './types';
import { IdiomaticQueryOptions } from '@chimeric/core';
import { validateMaxArgLength } from '../../utilities/validateMaxArgLength';

// Required params (must come first - most specific)
export function IdiomaticQueryFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): IdiomaticQuery<TParams, TResult, TError, TQueryKey>;

// Optional params (must come before no params)
export function IdiomaticQueryFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>;
}): IdiomaticQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params (least specific - must come last)
export function IdiomaticQueryFactory<
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, TError, TResult, TQueryKey>
  >;
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
              TError,
              TQueryKey
            >;
          })
        : maybeOptions;
    const nativeOptions = allOptions?.nativeOptions as
      | TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
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

    // Prioritize native options last so they can override anything
    if (nativeOptions) {
      fetchQueryOptions = {
        ...fetchQueryOptions,
        ...nativeOptions,
      };
    }

    return queryClient.fetchQuery(fetchQueryOptions);
  };

  return createIdiomaticQuery(idiomaticQuery) as IdiomaticQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
