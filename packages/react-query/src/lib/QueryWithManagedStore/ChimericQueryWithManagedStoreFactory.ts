import { QueryClient, UseQueryOptions, OmitKeyof } from '@tanstack/react-query';
import { ChimericQuery, fuseChimericQuery } from '@chimeric/core';
import { IdiomaticQueryWithManagedStoreFactory } from './IdiomaticQueryWithManagedStoreFactory';
import { ReactiveQueryWithManagedStoreFactory } from './ReactiveQueryWithManagedStoreFactory';

export const ChimericQueryWithManagedStoreFactory = <
  TParams = void,
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
): ChimericQuery<TParams, TResult, E> => {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryWithManagedStoreFactory<TParams, TResult>(
      queryClient,
      {
        queryFn,
        getQueryOptions,
        getFromStore,
      },
    ),
    reactive: ReactiveQueryWithManagedStoreFactory<TParams, TResult, E>({
      queryFn,
      getQueryOptions,
      useFromStore,
    }).useQuery,
  });
};
