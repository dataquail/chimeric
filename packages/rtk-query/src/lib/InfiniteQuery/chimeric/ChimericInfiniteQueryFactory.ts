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
} from '@reduxjs/toolkit/query';
import { fuseChimericInfiniteQuery } from '@chimeric/core';
import { IdiomaticInfiniteQueryFactory } from '../idiomatic/IdiomaticInfiniteQueryFactory';
import { ReactiveInfiniteQueryFactory } from '../reactive/ReactiveInfiniteQueryFactory';
import { type ChimericInfiniteQuery } from './types';

type InfiniteQueryEndpointWithHooks = {
  useInfiniteQuery: (arg: any, options?: any) => any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiWithUsePrefetch = { usePrefetch: (...args: any[]) => any };

export function ChimericInfiniteQueryFactory<
  D extends InfiniteQueryDefinition<any, any, any, any, any>,
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
  endpoint: ApiEndpointInfiniteQuery<D, Definitions> &
    InfiniteQueryEndpointWithHooks;
  endpointName: string;
  api: Api<BaseQueryFn, Definitions, ReducerPath, TagTypes> & ApiWithUsePrefetch;
}): ChimericInfiniteQuery<
  InfiniteQueryArgFrom<D>,
  ResultTypeFrom<D>,
  PageParamFrom<D>,
  TError
> {
  const idiomatic = IdiomaticInfiniteQueryFactory({
    store,
    endpoint,
    endpointName,
    api,
  });

  const reactive = ReactiveInfiniteQueryFactory<D, Definitions, ReducerPath, TagTypes, TError>({
    endpoint,
    endpointName,
    api,
  });

  return fuseChimericInfiniteQuery({
    idiomatic,
    reactive: reactive as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  }) as ChimericInfiniteQuery<
    InfiniteQueryArgFrom<D>,
    ResultTypeFrom<D>,
    PageParamFrom<D>,
    TError
  >;
}
