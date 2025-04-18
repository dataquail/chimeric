import { QueryClient, UseQueryOptions, OmitKeyof } from '@tanstack/react-query';
import {
  IdiomaticQuery,
  IdiomaticQueryOptions,
  isIdiomaticQuery,
} from '@chimeric/core';

// Overloads
export function IdiomaticQueryWithManagedStoreFactory<TResult = unknown>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
  }: {
    queryFn: () => Promise<void>;
    getQueryOptions: () => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: () => TResult;
  },
): IdiomaticQuery<void, TResult>;
export function IdiomaticQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
  }: {
    queryFn: (args: TParams) => Promise<void>;
    getQueryOptions: (
      args: TParams,
    ) => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: (args: TParams) => TResult;
  },
): IdiomaticQuery<TParams, TResult>;

// Implementation
export function IdiomaticQueryWithManagedStoreFactory<
  TParams extends void | object,
  TResult = unknown,
>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
  }: {
    queryFn: (args: TParams) => Promise<void>;
    getQueryOptions: (
      args: TParams,
    ) => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: (args: TParams) => TResult;
  },
): IdiomaticQuery<TParams, TResult> {
  const idiomaticQuery = async (
    paramsAndOptions?: TParams & { options?: IdiomaticQueryOptions },
  ) => {
    const { options, ...params } = paramsAndOptions ?? {};
    const queryOptions = getQueryOptions(params as TParams);
    if (options?.forceRefetch) {
      await queryClient.invalidateQueries({
        queryKey: queryOptions.queryKey,
      });
    }

    if (!queryOptions.queryKey) {
      throw new Error('queryKey is required');
    }

    await queryClient.fetchQuery({
      ...queryOptions,
      queryKey: queryOptions.queryKey,
      queryFn: async () => {
        await queryFn(params as TParams);
        return null;
      },
    });
    return getFromStore(params as TParams);
  };

  if (isIdiomaticQuery<TParams, TResult>(idiomaticQuery)) {
    return idiomaticQuery;
  } else {
    throw new Error('idiomaticQuery is not qualified to be idiomatic query');
  }
}
