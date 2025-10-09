/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type QueryKey,
  useQuery,
  queryOptions,
  DefinedInitialDataOptions,
} from '@tanstack/react-query';
import {
  ReactiveQuery,
  TanstackQueryReactiveNativeOptions,
} from '../Query/reactive/types';
import { createReactiveQuery } from '../Query/reactive/createReactiveQuery';
import { validateMaxArgLength } from '../utilities/validateMaxArgLength';
import { ReactiveQueryOptions } from '@chimeric/core';

// Required params (must come first - most specific)
export function ReactiveQueryWithManagedStoreFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  useFromStore: (params: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey>;

// Optional params (must come before no params)
export function ReactiveQueryWithManagedStoreFactory<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: (
    params?: TParams,
  ) => ReturnType<typeof queryOptions<void, TError, void, TQueryKey>>;
  useFromStore: (params?: TParams) => TResult;
}): ReactiveQuery<TParams | undefined, TResult, TError, TQueryKey>;

// No params (least specific - must come last)
export function ReactiveQueryWithManagedStoreFactory<
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(config: {
  getQueryOptions: () => ReturnType<
    typeof queryOptions<void, TError, void, TQueryKey>
  >;
  useFromStore: () => TResult;
}): ReactiveQuery<void, TResult, TError, TQueryKey>;

// Implementation
export function ReactiveQueryWithManagedStoreFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>({
  getQueryOptions,
  useFromStore,
}: {
  getQueryOptions: any;
  useFromStore: any;
}): ReactiveQuery<TParams, TResult, TError, TQueryKey> {
  validateMaxArgLength({
    fn: getQueryOptions,
    fnName: 'getQueryOptions',
    maximumLength: 1,
  });
  validateMaxArgLength({
    fn: useFromStore,
    fnName: 'useFromStore',
    maximumLength: 1,
  });
  return createReactiveQuery(
    (
      paramsOrOptions?: Parameters<
        ReactiveQuery<TParams, TResult, TError, TQueryKey>['use']
      >[0],
      maybeOptions?: Parameters<
        ReactiveQuery<TParams, TResult, TError, TQueryKey>['use']
      >[1],
    ) => {
      const params =
        getQueryOptions.length === 0
          ? (undefined as TParams)
          : (paramsOrOptions as TParams);
      const allOptions =
        getQueryOptions.length === 0
          ? (paramsOrOptions as {
              options?: ReactiveQueryOptions;
              nativeOptions?: TanstackQueryReactiveNativeOptions<
                TResult,
                TError,
                TQueryKey
              >;
            })
          : maybeOptions;
      const nativeOptions = allOptions?.nativeOptions as
        | TanstackQueryReactiveNativeOptions<TResult, TError, TQueryKey>
        | undefined;
      let fetchQueryOptions: ReturnType<
        typeof queryOptions<any, TError, void, TQueryKey>
      > = getQueryOptions(params);

      if (allOptions?.options?.enabled === false) {
        fetchQueryOptions.enabled = false;
      }

      // Prioritize native options last so they can override anything
      if (nativeOptions) {
        fetchQueryOptions = {
          ...fetchQueryOptions,
          ...nativeOptions,
        };
      }

      const { queryFn, ...restInitialQueryOptions } = fetchQueryOptions;

      const query = useQuery({
        ...restInitialQueryOptions,
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
  ) as ReactiveQuery<TParams, TResult, TError, TQueryKey>;
}
