import {
  QueryOptions,
  useQuery as useTanstackQuery,
  UseQueryOptions,
  OmitKeyof,
} from '@tanstack/react-query';
import { ReactiveQuery, createReactiveQuery } from '@chimeric/core';
import { getParamsAndOptionsFromReactiveQuery } from '../utils';

export const ReactiveQueryWithManagedStoreFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  queryFn,
  getQueryOptions,
  useFromStore,
}: {
  queryFn: (args: TParams) => Promise<void>;
  getQueryOptions: (
    args: TParams,
  ) => OmitKeyof<UseQueryOptions<unknown, Error, unknown, string[]>, 'queryFn'>;
  useFromStore: (args: TParams) => TResult;
}): ReactiveQuery<TParams, TResult, E> => {
  return createReactiveQuery((paramsOrOptions, optionsOrNever) => {
    const { params, options } = getParamsAndOptionsFromReactiveQuery(
      paramsOrOptions,
      optionsOrNever,
    );
    const queryOptions = getQueryOptions(params as TParams);
    if (!queryOptions.queryKey) {
      throw new Error('queryKey is required');
    }
    const query = useTanstackQuery({
      ...(queryOptions as QueryOptions<unknown, E, unknown, string[]>),
      ...(options as UseQueryOptions<unknown, E, unknown, string[]>),
      queryFn: async () => {
        await queryFn(params as TParams);
        return null;
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
    };
  });
};
