import { type ChimericMutation as CoreChimericMutation } from '@chimeric/core';
import {
  SvelteMutationReactiveInvokeOptions,
  SvelteMutationReactiveNativeOptions,
  SvelteMutationReactiveReturnType,
} from '../reactive/types';
import { SvelteIdiomaticMutationNativeOptions } from '../idiomatic/types';

export type ChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = CoreChimericMutation<
  TParams,
  TResult,
  TError,
  SvelteIdiomaticMutationNativeOptions<TParams, TResult, TError>,
  SvelteMutationReactiveNativeOptions<TParams, TResult, TError>,
  SvelteMutationReactiveInvokeOptions<TParams, TResult, TError>,
  SvelteMutationReactiveReturnType<TParams, TResult, TError>
>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ChimericMutation<void, Awaited<ReturnType<T>>, TError>
  : ChimericMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
