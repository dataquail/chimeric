import { IdiomaticQuery } from './types';
import { FetchQueryOptions, QueryKey } from '@tanstack/react-query';
import {
  createIdiomaticQuery as coreCreateIdiomaticQuery,
  IdiomaticQueryOptions,
} from '@chimeric/core';

// Overloads
export function createIdiomaticQuery<
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (params?: {
    options?: IdiomaticQueryOptions;
    nativeOptions?: FetchQueryOptions<TResult, E, TResult, TQueryKey>;
  }) => ReturnType<IdiomaticQuery<undefined, TResult, E, TQueryKey>>,
): IdiomaticQuery<undefined, TResult, E, TQueryKey>;
export function createIdiomaticQuery<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticQueryOptions;
      nativeOptions?: FetchQueryOptions<TResult, E, TResult, TQueryKey>;
    },
  ) => ReturnType<IdiomaticQuery<TParams, TResult, E, TQueryKey>>,
): IdiomaticQuery<TParams, TResult, E, TQueryKey>;

// Implementation
export function createIdiomaticQuery<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticQueryOptions;
      nativeOptions?: FetchQueryOptions<TResult, E, TResult, TQueryKey>;
    },
  ) => ReturnType<IdiomaticQuery<TParams, TResult, E, TQueryKey>>,
): IdiomaticQuery<TParams, TResult, E, TQueryKey> {
  return coreCreateIdiomaticQuery(idiomaticFn) as IdiomaticQuery<
    TParams,
    TResult,
    E,
    TQueryKey
  >;
}
