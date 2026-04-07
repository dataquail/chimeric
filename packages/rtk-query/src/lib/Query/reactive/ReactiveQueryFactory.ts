import type {
  ApiEndpointQuery,
  QueryDefinition,
  EndpointDefinitions,
  QueryArgFrom,
  ResultTypeFrom,
  Api,
  BaseQueryFn,
  PrefetchOptions,
  SubscriptionOptions,
} from '@reduxjs/toolkit/query';
import { createReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import { wrapRtkError } from '../../utilities/wrapRtkError';
import { ReactiveQuery } from './types';

type QueryEndpointWithHooks = {
  useQuery: (arg: any, options?: any) => any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiWithUsePrefetch = { usePrefetch: (...args: any[]) => any };

export function ReactiveQueryFactory<
  D extends QueryDefinition<any, any, any, any>,
  Definitions extends EndpointDefinitions,
  ReducerPath extends string = string,
  TagTypes extends string = string,
  TError extends Error = Error,
>({
  endpoint,
  endpointName,
  api,
}: {
  endpoint: ApiEndpointQuery<D, Definitions> & QueryEndpointWithHooks;
  endpointName: string;
  api: Api<BaseQueryFn, Definitions, ReducerPath, TagTypes> & ApiWithUsePrefetch;
}): ReactiveQuery<QueryArgFrom<D>, ResultTypeFrom<D>, TError> {
  const query = (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const params = first as QueryArgFrom<D>;
    const allOptions = second as
      | {
          options?: ReactiveQueryOptions;
          nativeOptions?: SubscriptionOptions & Record<string, unknown>;
        }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    const hookOptions = {
      ...(allOptions?.options?.enabled === false ? { skip: true } : {}),
      ...(nativeOptions ?? {}),
    };

    const result = endpoint.useQuery(params, hookOptions);

    return {
      isIdle: result.isUninitialized,
      isPending: result.isLoading,
      isSuccess: result.isSuccess,
      isError: result.isError,
      error: result.error ? (wrapRtkError(result.error) as TError) : null,
      data: result.data as ResultTypeFrom<D> | undefined,
      refetch: async () => {
        const refetched = await result.refetch();
        return refetched.data as ResultTypeFrom<D>;
      },
      native: result,
    };
  };

  const prefetchHook = (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const params = first as QueryArgFrom<D>;
    const allOptions = second as
      | { nativeOptions?: PrefetchOptions }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    const prefetch = api.usePrefetch(endpointName, nativeOptions);
    prefetch(params);
  };

  return createReactiveQuery(query, prefetchHook) as ReactiveQuery<
    QueryArgFrom<D>,
    ResultTypeFrom<D>,
    TError
  >;
}
