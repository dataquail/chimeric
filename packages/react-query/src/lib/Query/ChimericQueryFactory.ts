import { type QueryClient, type QueryOptions } from '@tanstack/react-query';
import { ChimericQuery, fuseChimericQuery } from '@chimeric/core';
import { IdiomaticQueryFactory } from './IdiomaticQueryFactory';
import { ReactiveQueryFactory } from './ReactiveQueryFactory';

export const ChimericQueryFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  getQueryOptions: (
    args: TParams,
  ) => QueryOptions<TResult, E, TResult, string[]>,
): ChimericQuery<TParams, TResult, E> => {
  return fuseChimericQuery({
    idiomatic: IdiomaticQueryFactory(queryClient, getQueryOptions),
    reactive: ReactiveQueryFactory(getQueryOptions).useQuery,
  });
};
