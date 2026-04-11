import { IdiomaticMutation as CoreIdiomaticMutation } from '@chimeric/core';
import { TanstackIdiomaticNativeOptions } from '../idiomatic/types';
import { ReactiveMutation } from '../reactive/types';

export type ChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = CoreIdiomaticMutation<
  TParams,
  TResult,
  TanstackIdiomaticNativeOptions<TParams, TResult, TError>
> &
  ReactiveMutation<TParams, TResult, TError>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ChimericMutation<void, Awaited<ReturnType<T>>, TError>
  : ChimericMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
