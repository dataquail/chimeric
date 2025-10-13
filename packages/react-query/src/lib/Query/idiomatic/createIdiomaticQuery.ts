import { IdiomaticQuery } from './types';
import { QueryKey } from '@tanstack/react-query';
import {
  createIdiomaticQuery as coreCreateIdiomaticQuery,
  IdiomaticQueryOptions,
} from '@chimeric/core';
import { TanstackIdiomaticNativeOptions } from 'src/lib/Mutation/idiomatic/types';

// Overload for no params (allOptions as first arg)
export function createIdiomaticQuery<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (allOptions?: {
    options?: IdiomaticQueryOptions;
    nativeOptions?: TanstackIdiomaticNativeOptions<void, TResult, TError>;
  }) => Promise<TResult>,
): IdiomaticQuery<void, TResult, TError, TQueryKey>;

// Overload for optional params (params as first arg, allOptions as second)
export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (
    params?: TParams,
    allOptions?: {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TanstackIdiomaticNativeOptions<TParams, TResult, TError>;
    },
  ) => Promise<TResult>,
): IdiomaticQuery<TParams | undefined, TResult, TError, TQueryKey>;

// Overload for required params (params as first arg, allOptions as second)
export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (
    params: TParams,
    allOptions?: {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TanstackIdiomaticNativeOptions<TParams, TResult, TError>;
    },
  ) => Promise<TResult>,
): IdiomaticQuery<TParams, TResult, TError, TQueryKey>;

// Implementation
export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(idiomaticFn: any): IdiomaticQuery<TParams, TResult, TError, TQueryKey> {
  return coreCreateIdiomaticQuery(idiomaticFn) as IdiomaticQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
