import {
  ReactiveMutation as CoreReactiveMutation,
  DefineReactiveMutation as CoreDefineReactiveMutation,
} from '@chimeric/core';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { TypedUseMutationResult } from '@reduxjs/toolkit/query/react';

export type RtkMutationReactiveNativeOptions = {
  fixedCacheKey?: string;
};

export type RtkMutationReactiveInvokeOptions = Record<string, never>;

export type RtkMutationReactiveReturnType<
  TResult = unknown,
  TArg = void,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = TypedUseMutationResult<TResult, TArg, BaseQuery>;

export type ReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreReactiveMutation<
  TParams,
  TResult,
  TError,
  RtkMutationReactiveNativeOptions,
  RtkMutationReactiveInvokeOptions,
  RtkMutationReactiveReturnType<TResult, TParams, BaseQuery>
>;

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreDefineReactiveMutation<
  T,
  TError,
  RtkMutationReactiveNativeOptions,
  RtkMutationReactiveInvokeOptions,
  RtkMutationReactiveReturnType<
    Awaited<ReturnType<T>>,
    Parameters<T> extends [] ? void : Parameters<T>[0],
    BaseQuery
  >
>;
