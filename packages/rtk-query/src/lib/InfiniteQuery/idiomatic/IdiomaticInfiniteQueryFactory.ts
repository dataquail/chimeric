import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type {
  ApiEndpointInfiniteQuery,
  InfiniteQueryDefinition,
  EndpointDefinitions,
  InfiniteQueryArgFrom,
  ResultTypeFrom,
  PageParamFrom,
  Api,
  BaseQueryFn,
  StartQueryActionCreatorOptions,
} from '@reduxjs/toolkit/query';
import {
  createIdiomaticInfiniteQuery,
  IdiomaticInfiniteQueryOptions,
} from '@chimeric/core';
import {
  IdiomaticInfiniteQuery,
  RtkInfiniteQueryIdiomaticNativeOptions,
} from './types';

export function IdiomaticInfiniteQueryFactory<
  D extends InfiniteQueryDefinition<any, any, any, any, any>,
  Definitions extends EndpointDefinitions,
  ReducerPath extends string = string,
  TagTypes extends string = string,
>({
  store,
  endpoint,
  endpointName,
  api,
}: {
  store: { dispatch: ThunkDispatch<any, any, UnknownAction> };
  endpoint: ApiEndpointInfiniteQuery<D, Definitions>;
  endpointName: string;
  api: Api<BaseQueryFn, Definitions, ReducerPath, TagTypes>;
}): IdiomaticInfiniteQuery<
  InfiniteQueryArgFrom<D>,
  ResultTypeFrom<D>,
  PageParamFrom<D>
> {
  const idiomaticInfiniteQuery = async (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const params = first as InfiniteQueryArgFrom<D>;
    const allOptions = second as
      | {
          options?: IdiomaticInfiniteQueryOptions<PageParamFrom<D>>;
          nativeOptions?: RtkInfiniteQueryIdiomaticNativeOptions;
        }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    const initiateOptions: StartQueryActionCreatorOptions = {
      subscribe: false,
      ...(allOptions?.options?.forceRefetch ? { forceRefetch: true } : {}),
      ...(nativeOptions ?? {}),
    };

    const result = store.dispatch(
      endpoint.initiate(params, initiateOptions),
    );
    try {
      const data = await result.unwrap();
      return {
        pages: data.pages as ResultTypeFrom<D>[],
        pageParams: data.pageParams as PageParamFrom<D>[],
      };
    } finally {
      result.unsubscribe();
    }
  };

  const prefetch = async (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const params = first as InfiniteQueryArgFrom<D>;
    const allOptions = second as
      | { nativeOptions?: RtkInfiniteQueryIdiomaticNativeOptions }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    store.dispatch(
      (api.util as any).prefetch(endpointName, params, {
        force: false,
        ...(nativeOptions ?? {}),
      }),
    );
  };

  return createIdiomaticInfiniteQuery(
    idiomaticInfiniteQuery,
    prefetch,
  ) as IdiomaticInfiniteQuery<
    InfiniteQueryArgFrom<D>,
    ResultTypeFrom<D>,
    PageParamFrom<D>
  >;
}
