import {
  ChimericQuery as CoreChimericQuery,
  DefineChimericQuery as CoreDefineChimericQuery,
} from '@chimeric/core';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { RtkQueryIdiomaticNativeOptions } from '../idiomatic/types';
import {
  RtkQueryReactiveNativeOptions,
  RtkQueryReactivePrefetchNativeOptions,
  RtkQueryReactiveReturnType,
} from '../reactive/types';

export type ChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreChimericQuery<
  TParams,
  TResult,
  TError,
  RtkQueryIdiomaticNativeOptions,
  RtkQueryReactiveNativeOptions<TResult, TParams, BaseQuery>,
  RtkQueryReactiveReturnType<TResult, TParams, BaseQuery>,
  RtkQueryReactivePrefetchNativeOptions
>;

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreDefineChimericQuery<
  T,
  TError,
  RtkQueryIdiomaticNativeOptions,
  RtkQueryReactiveNativeOptions<
    Awaited<ReturnType<T>>,
    Parameters<T> extends [] ? void : Parameters<T>[0],
    BaseQuery
  >,
  RtkQueryReactiveReturnType<
    Awaited<ReturnType<T>>,
    Parameters<T> extends [] ? void : Parameters<T>[0],
    BaseQuery
  >,
  RtkQueryReactivePrefetchNativeOptions
>;
