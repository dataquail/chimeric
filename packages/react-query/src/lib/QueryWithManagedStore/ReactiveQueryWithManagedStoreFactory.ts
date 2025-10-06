import {
  type QueryKey,
  useQuery,
  queryOptions,
  DefinedInitialDataOptions,
} from '@tanstack/react-query';
import { ReactiveQuery } from '../Query/reactive/types';
import { createReactiveQuery } from '../Query/reactive/createReactiveQuery';

export function ReactiveQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  useFromStore,
  getQueryOptions,
}: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  useFromStore: (params: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  return createReactiveQuery((params, { options, nativeOptions } = {}) => {
    const { queryFn, ...restInitialQueryOptions } = getQueryOptions(params);

    const query = useQuery<TResult, TError, TResult, TQueryKey>({
      ...restInitialQueryOptions,
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
    } as DefinedInitialDataOptions<TResult, TError, TResult, TQueryKey>);
    const dataFromStore = useFromStore(params);

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
  });
}
