import {
  type QueryKey,
  type QueryClient,
  useQuery as useTanstackQuery,
  queryOptions,
} from '@tanstack/react-query';
import { ReactiveQuery } from '../Query/reactive/types';
import { createReactiveQuery } from '../Query/reactive/createReactiveQuery';

// Overloads
export function ReactiveQueryWithManagedStoreFactory<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getQueryOptions,
  useFromStore,
}: {
  getQueryOptions: () => ReturnType<
    typeof queryOptions<TResult, E, TResult, TQueryKey>
  >;
  useFromStore: () => TResult;
}): ReactiveQuery<undefined, TResult, E, TQueryKey>;
export function ReactiveQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getQueryOptions,
  useFromStore,
}: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>;
  useFromStore: (args: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function ReactiveQueryWithManagedStoreFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getQueryOptions,
  useFromStore,
}: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>;
  useFromStore: (args: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, E, TQueryKey> {
  return createReactiveQuery((paramsAndOptions) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const { queryFn, ...restQueryOptions } = getQueryOptions(params as TParams);
    const query = useTanstackQuery({
      ...restQueryOptions,
      enabled: options?.enabled ?? true,
      ...nativeOptions,
      // ensures queryFn returns a value (null) so caller doesn't need to remember to
      // write their queryFn to return a value
      queryFn: async (): Promise<TResult> => {
        if (queryFn && typeof queryFn === 'function') {
          await queryFn(
            params as {
              client: QueryClient;
              queryKey: TQueryKey;
              signal: AbortSignal;
              meta: Record<string, unknown> | undefined;
              pageParam?: unknown;
              direction?: unknown;
            },
          );
        }
        return null as unknown as TResult;
      },
    });
    const dataFromStore = useFromStore(params as TParams);

    return {
      isIdle: !query.isFetched,
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      isError: query.isError,
      error: query.error,
      data: dataFromStore,
      refetch: async () => {
        await query.refetch();
        return dataFromStore;
      },
      native: query,
    };
  }) as ReactiveQuery<TParams, TResult, E, TQueryKey>;
}
