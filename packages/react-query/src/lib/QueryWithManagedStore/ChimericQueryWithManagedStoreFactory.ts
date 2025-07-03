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
>(
  queryClient: QueryClient,
  options: {
    getFromStore: (args: TParams) => TResult;
    useFromStore: (args: TParams) => TResult;
    getQueryOptions: (
      args: TParams,
    ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  },
): ChimericQuery<
  TParams extends undefined ? void : TParams,
  TResult,
  TError,
  TQueryKey
> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryWithManagedStoreFactory(queryClient, options),
    reactive: ReactiveQueryWithManagedStoreFactory(options),
  }) as ChimericQuery<
    TParams extends undefined ? void : TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
