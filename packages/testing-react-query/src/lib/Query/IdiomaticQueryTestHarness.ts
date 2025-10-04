import { IdiomaticQuery, IdiomaticQueryOptions } from '@chimeric/core';
import {
  QueryKey,
  TanstackQueryIdiomaticNativeOptions,
} from '@chimeric/react-query';
import { IdiomaticQueryTestHarness as CoreIdiomaticQueryTestHarness } from '@chimeric/testing-core';
import { IdiomaticQueryTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function IdiomaticQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticQuery: IdiomaticQuery<
    TParams,
    TResult,
    TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
  >;
  params: TParams;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError>;

// Optional params (must come before no params)
export function IdiomaticQueryTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticQuery: IdiomaticQuery<
    TParams | undefined,
    TResult,
    TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
  >;
  params?: NonNullable<TParams>;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError>;

// No params (least specific - must come last)
export function IdiomaticQueryTestHarness<
  TResult,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticQuery: IdiomaticQuery<
    void,
    TResult,
    TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
  >;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError>;

// Implementation
export function IdiomaticQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
>(args: {
  idiomaticQuery: IdiomaticQuery<
    TParams,
    TResult,
    TanstackQueryIdiomaticNativeOptions<TResult, TError, TQueryKey>
  >;
  params?: TParams;
  options?: IdiomaticQueryOptions;
  nativeOptions?: TanstackQueryIdiomaticNativeOptions<
    TResult,
    TError,
    TQueryKey
  >;
}): IdiomaticQueryTestHarnessReturnType<TResult, TError> {
  return CoreIdiomaticQueryTestHarness(args as any);
}
