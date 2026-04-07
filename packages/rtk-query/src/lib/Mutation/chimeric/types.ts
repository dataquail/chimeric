import { ChimericMutation as CoreChimericMutation } from '@chimeric/core';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { RtkMutationIdiomaticNativeOptions } from '../idiomatic/types';
import {
  RtkMutationReactiveNativeOptions,
  RtkMutationReactiveInvokeOptions,
  RtkMutationReactiveReturnType,
} from '../reactive/types';

export type ChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = CoreChimericMutation<
  TParams,
  TResult,
  TError,
  RtkMutationIdiomaticNativeOptions,
  RtkMutationReactiveNativeOptions,
  RtkMutationReactiveInvokeOptions,
  RtkMutationReactiveReturnType<TResult, TParams, BaseQuery>
>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  BaseQuery extends BaseQueryFn = BaseQueryFn,
> = Parameters<T> extends []
  ? ChimericMutation<void, Awaited<ReturnType<T>>, TError, BaseQuery>
  : ChimericMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TError, BaseQuery>;
