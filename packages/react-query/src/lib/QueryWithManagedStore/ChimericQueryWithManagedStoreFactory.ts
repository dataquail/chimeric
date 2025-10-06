import {
  queryOptions,
  type QueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { type ChimericQuery } from '../Query/chimeric/types';
import { IdiomaticQueryWithManagedStoreFactory } from './IdiomaticQueryWithManagedStoreFactory';
import { ReactiveQueryWithManagedStoreFactory } from './ReactiveQueryWithManagedStoreFactory';
import { fuseChimericQuery } from '../Query/chimeric/fuseChimericQuery';

export function ChimericQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  queryClient,
  getFromStore,
  useFromStore,
  getQueryOptions,
}: {
  queryClient: QueryClient;
  getFromStore: (params: TParams) => TResult;
  useFromStore: (params: TParams) => TResult;
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
}): ChimericQuery<TParams, TResult, TError, TQueryKey> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryWithManagedStoreFactory({
      queryClient,
      getFromStore,
      getQueryOptions,
    }),
    reactive: ReactiveQueryWithManagedStoreFactory({
      useFromStore,
      getQueryOptions,
    }),
  });
}
