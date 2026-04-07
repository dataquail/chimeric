import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type {
  ApiEndpointQuery,
  QueryDefinition,
  EndpointDefinitions,
  QueryArgFrom,
  ResultTypeFrom,
  Api,
  BaseQueryFn,
  StartQueryActionCreatorOptions,
} from '@reduxjs/toolkit/query';
import { createIdiomaticQuery, IdiomaticQueryOptions } from '@chimeric/core';
import { IdiomaticQuery } from './types';

type RtkStore = {
  dispatch: ThunkDispatch<any, any, UnknownAction>;
};

export function IdiomaticQueryFactory<
  D extends QueryDefinition<any, any, any, any>,
  Definitions extends EndpointDefinitions,
  ReducerPath extends string = string,
  TagTypes extends string = string,
>({
  store,
  endpoint,
  endpointName,
  api,
}: {
  store: RtkStore;
  endpoint: ApiEndpointQuery<D, Definitions>;
  endpointName: string;
  api: Api<BaseQueryFn, Definitions, ReducerPath, TagTypes>;
}): IdiomaticQuery<QueryArgFrom<D>, ResultTypeFrom<D>> {
  const idiomaticQuery = async (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const params = first as QueryArgFrom<D>;
    const allOptions = second as
      | {
          options?: IdiomaticQueryOptions;
          nativeOptions?: StartQueryActionCreatorOptions;
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
      return await result.unwrap();
    } finally {
      result.unsubscribe();
    }
  };

  const prefetch = async (
    ...args: unknown[]
  ) => {
    const [first, second] = args;
    const params = first as QueryArgFrom<D>;
    const allOptions = second as
      | { nativeOptions?: StartQueryActionCreatorOptions }
      | undefined;
    const nativeOptions = allOptions?.nativeOptions;

    store.dispatch(
      (api.util as any).prefetch(endpointName, params, {
        force: false,
        ...(nativeOptions ?? {}),
      }),
    );
  };

  return createIdiomaticQuery(idiomaticQuery, prefetch) as IdiomaticQuery<
    QueryArgFrom<D>,
    ResultTypeFrom<D>
  >;
}
