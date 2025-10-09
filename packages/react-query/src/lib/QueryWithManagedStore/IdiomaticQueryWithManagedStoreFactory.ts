/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FetchQueryOptions,
  type QueryClient,
  type QueryKey,
  queryOptions,
} from '@tanstack/react-query';
import { createIdiomaticQuery } from '../Query/idiomatic/createIdiomaticQuery';
import {
  IdiomaticQuery,
  TanstackQueryIdiomaticNativeOptions,
} from '../Query/idiomatic/types';
import { validateMaxArgLength } from '../utilities/validateMaxArgLength';
import { IdiomaticQueryOptions } from 'node_modules/@chimeric/core/src/lib/Query/idiomatic/types';

// Required params (must come first - most specific)
export function IdiomaticQueryWithManagedStoreFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getFromStore: (params: TParams) => TResult;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
}): IdiomaticQuery<TParams, TResult, TError, TQueryKey>;

// Optional params (must come before no params)
export function IdiomaticQueryWithManagedStoreFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getFromStore: (params?: TParams) => TResult;
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
}): IdiomaticQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params (least specific - must come last)
export function IdiomaticQueryWithManagedStoreFactory<
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  queryClient: QueryClient;
  getFromStore: () => TResult;
  getQueryOptions: () => ReturnType<
    typeof queryOptions<void, TError, void, TQueryKey>
  >;
}): IdiomaticQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function IdiomaticQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getFromStore,
  getQueryOptions,
}: {
  queryClient: QueryClient;
  getFromStore: any;
  getQueryOptions: any;
}): IdiomaticQuery<TParams, TResult, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getQueryOptions,
    fnName: 'getQueryOptions',
    maximumLength: 1,
  });
  validateMaxArgLength({
    fn: getFromStore,
    fnName: 'getFromStore',
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

    const { queryFn, queryKey, ...restInitialQueryOptions } = fetchQueryOptions;

    await queryClient.fetchQuery({
      queryKey,
      ...restInitialQueryOptions,
      queryFn: async (context): Promise<TResult> => {
        if (queryFn && typeof queryFn === 'function') {
          await queryFn(context);
        }
        return null as unknown as TResult;
      },
    });

    return getFromStore(params);
  };

  return createIdiomaticQuery(idiomaticQuery) as IdiomaticQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
