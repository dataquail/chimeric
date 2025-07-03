import {
  queryOptions,
  type QueryKey,
  type QueryClient,
} from '@tanstack/react-query';
import { IdiomaticQueryFactory } from '../idiomatic/IdiomaticQueryFactory';
import { ReactiveQueryFactory } from '../reactive/ReactiveQueryFactory';
import { fuseChimericQuery } from './fuseChimericQuery';
import { type ChimericQuery } from './types';

export function ChimericQueryFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    params: TParams,
  ) => ReturnType<typeof queryOptions<TResult, TError, TResult, TQueryKey>>,
): ChimericQuery<
  TParams extends undefined ? void : TParams,
  TResult,
  TError,
  TQueryKey
> {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryFactory(queryClient, getQueryOptions),
    reactive: ReactiveQueryFactory(getQueryOptions),
  });
}
