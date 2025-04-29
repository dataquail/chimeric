import { type QueryKey, useQuery, queryOptions } from '@tanstack/react-query';
import { ReactiveQuery } from '../Query/reactive/types';
import { createReactiveQuery } from '../Query/reactive/createReactiveQuery';

// Overloads
export function ReactiveQueryWithManagedStoreFactory<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(options: {
  getQueryOptions: () => ReturnType<
    typeof queryOptions<void, E, void, TQueryKey>
  >;
  useFromStore: () => TResult;
}): ReactiveQuery<undefined, TResult, E, TQueryKey>;
export function ReactiveQueryWithManagedStoreFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(options: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
  useFromStore: (args: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function ReactiveQueryWithManagedStoreFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(initialOptions: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, E, void, TQueryKey>>;
  useFromStore: (args: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, E, TQueryKey> {
  const { useFromStore, getQueryOptions } = initialOptions;
  return createReactiveQuery((paramsAndOptions) => {
    const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
    const { queryFn, ...restInitialQueryOptions } = getQueryOptions(
      params as TParams,
    );
    const query = useQuery<TResult, E, TResult, TQueryKey>({
      ...(restInitialQueryOptions as Omit<
        ReturnType<typeof queryOptions<TResult, E, TResult, TQueryKey>>,
        'queryFn'
      >),
      enabled: options?.enabled ?? true,
      ...nativeOptions,
      queryFn: async (context): Promise<TResult> => {
        if (typeof queryFn === 'function') {
          await queryFn(context);
        }
        // ensures queryFn returns a value (null) so caller doesn't need to remember to
        // write their queryFn to return a value. The return value is ideally void,
        // but tanstack query doesn't support void. The return value does not matter
        // because the store is managed by the user directly.
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
