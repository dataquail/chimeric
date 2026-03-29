import { IdiomaticQuery, TanstackQueryIdiomaticNativeOptions } from './types';
import { QueryKey } from '@tanstack/react-query';
import {
  createIdiomaticQuery as coreCreateIdiomaticQuery,
  IdiomaticQueryOptions,
} from '@chimeric/core';

// Overload for no params (allOptions as first arg)
export function createIdiomaticQuery<
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: (allOptions?: {
    options?: IdiomaticQueryOptions;
    nativeOptions?: TanstackQueryIdiomaticNativeOptions<
      TResult,
      TError,
      TQueryKey
    >;
  }) => Promise<TResult>,
  prefetchFn: (allOptions?: {
    nativeOptions?: TanstackQueryIdiomaticNativeOptions<
      TResult,
      TError,
      TQueryKey
    >;
  }) => Promise<void>,
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
      nativeOptions?: TanstackQueryIdiomaticNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => Promise<TResult>,
  prefetchFn: (
    params?: TParams,
    allOptions?: {
      nativeOptions?: TanstackQueryIdiomaticNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => Promise<void>,
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
      nativeOptions?: TanstackQueryIdiomaticNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => Promise<TResult>,
  prefetchFn: (
    params: TParams,
    allOptions?: {
      nativeOptions?: TanstackQueryIdiomaticNativeOptions<
        TResult,
        TError,
        TQueryKey
      >;
    },
  ) => Promise<void>,
): IdiomaticQuery<TParams, TResult, TError, TQueryKey>;

// Implementation
export function createIdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(
  idiomaticFn: any,
  prefetchFn: any,
): IdiomaticQuery<TParams, TResult, TError, TQueryKey> {
  return coreCreateIdiomaticQuery(idiomaticFn, prefetchFn) as IdiomaticQuery<
    TParams,
    TResult,
    TError,
    TQueryKey
  >;
}
