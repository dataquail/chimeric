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
>(initialOptions: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  useFromStore: (args: TParams) => TResult;
}): ReactiveQuery<
  TParams extends undefined ? void : TParams,
  TResult,
  TError,
  TQueryKey
> {
  const { useFromStore, getQueryOptions } = initialOptions;
  return createReactiveQuery(
    (
      paramsAndOptions: Parameters<
        ReactiveQuery<TParams, TResult, TError>['use']
      >[0],
    ) => {
      const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
      const { queryFn, ...restInitialQueryOptions } = getQueryOptions(
        params as TParams,
      );
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
    },
  ) as ReactiveQuery<
    TParams extends undefined ? void : TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
