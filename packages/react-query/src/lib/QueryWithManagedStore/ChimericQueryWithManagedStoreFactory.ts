import { QueryClient, UseQueryOptions, OmitKeyof } from '@tanstack/react-query';
import { ChimericQuery, fuseChimericQuery } from '@chimeric/core';
import { IdiomaticQueryWithManagedStoreFactory } from './IdiomaticQueryWithManagedStoreFactory';
import { ReactiveQueryWithManagedStoreFactory } from './ReactiveQueryWithManagedStoreFactory';

// Overloads
export function ChimericQueryWithManagedStoreFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
    useFromStore,
  }: {
    queryFn: () => Promise<void>;
    getQueryOptions: () => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: () => TResult;
    useFromStore: () => TResult;
  },
): ChimericQuery<undefined, TResult, E>;

export function ChimericQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
    useFromStore,
  }: {
    queryFn: (args: TParams) => Promise<void>;
    getQueryOptions: (
      args: TParams,
    ) => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
  },
): ChimericQuery<TParams, TResult, E>;

// Implementation
export function ChimericQueryWithManagedStoreFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  {
    queryFn,
    getQueryOptions,
    getFromStore,
    useFromStore,
  }: {
    queryFn: (args: TParams) => Promise<void>;
    getQueryOptions: (
      args: TParams,
    ) => OmitKeyof<
      UseQueryOptions<unknown, Error, unknown, string[]>,
      'queryFn'
    >;
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
  },
): ChimericQuery<TParams, TResult, E> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryWithManagedStoreFactory(queryClient, {
      queryFn,
      getQueryOptions,
      getFromStore,
    } as {
      queryFn: () => Promise<void>;
      getQueryOptions: () => OmitKeyof<
        UseQueryOptions<unknown, Error, unknown, string[]>,
        'queryFn'
      >;
      getFromStore: () => TResult;
    }),
    reactive: ReactiveQueryWithManagedStoreFactory({
      queryFn,
      getQueryOptions,
      useFromStore,
    } as {
      queryFn: () => Promise<void>;
      getQueryOptions: () => OmitKeyof<
        UseQueryOptions<unknown, Error, unknown, string[]>,
        'queryFn'
      >;
      useFromStore: () => TResult;
    }),
  }) as ChimericQuery<TParams, TResult, E>;
}
