import { type ChimericMutation as CoreChimericMutation } from '@chimeric/core';
import {
  TanstackMutationReactiveInvokeOptions,
  TanstackMutationReactiveNativeOptions,
  TanstackMutationReactiveReturnType,
} from '../reactive/types';
import { TanstackIdiomaticNativeOptions } from '../idiomatic/types';

export type ChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = CoreChimericMutation<
  TParams,
  TResult,
  TError,
  TanstackIdiomaticNativeOptions<TParams, TResult, TError>,
  TanstackMutationReactiveNativeOptions<TParams, TResult, TError>,
  TanstackMutationReactiveInvokeOptions<TParams, TResult, TError>,
  TanstackMutationReactiveReturnType<TParams, TResult, TError>
>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ChimericMutation<void, Awaited<ReturnType<T>>, TError>
  : ChimericMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
