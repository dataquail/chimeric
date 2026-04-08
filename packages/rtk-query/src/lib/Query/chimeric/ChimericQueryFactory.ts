import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import type {
  ApiEndpointQuery,
  QueryDefinition,
  EndpointDefinitions,
  QueryArgFrom,
  ResultTypeFrom,
  Api,
  BaseQueryFn,
} from '@reduxjs/toolkit/query';
import { fuseChimericQuery } from '@chimeric/core';
import { IdiomaticQueryFactory } from '../idiomatic/IdiomaticQueryFactory';
import { ReactiveQueryFactory } from '../reactive/ReactiveQueryFactory';
import { type ChimericQuery } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any -- RTK Query types require `any` for generic constraints and hook signatures */
type QueryEndpointWithHooks = {
  useQuery: (arg: any, options?: any) => any;
};

type ApiWithUsePrefetch = { usePrefetch: (...args: any[]) => any };

export function ChimericQueryFactory<
  D extends QueryDefinition<any, any, any, any>,
  Definitions extends EndpointDefinitions,
  ReducerPath extends string = string,
  TagTypes extends string = string,
  TError extends Error = Error,
>({
  store,
  endpoint,
  endpointName,
  api,
}: {
  store: { dispatch: ThunkDispatch<any, any, UnknownAction> };
  endpoint: ApiEndpointQuery<D, Definitions> & QueryEndpointWithHooks;
  endpointName: string;
  api: Api<BaseQueryFn, Definitions, ReducerPath, TagTypes> &
    ApiWithUsePrefetch;
}): ChimericQuery<QueryArgFrom<D>, ResultTypeFrom<D>, TError> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryFactory({ store, endpoint, endpointName, api }),
    reactive: ReactiveQueryFactory<D, Definitions, ReducerPath, TagTypes, TError>({ endpoint, endpointName, api }),
  }) as ChimericQuery<QueryArgFrom<D>, ResultTypeFrom<D>, TError>;
}
