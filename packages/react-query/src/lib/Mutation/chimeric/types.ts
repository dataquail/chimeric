import {
  type ChimericMutation as CoreChimericMutation,
  type DefineChimericMutation as CoreDefineChimericMutation,
} from '@chimeric/core';
import {
  TanstackMutationReactiveCallOptions,
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
  TanstackMutationReactiveCallOptions<TParams, TResult, TError>,
  TanstackMutationReactiveReturnType<TParams, TResult, TError>
>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = CoreDefineChimericMutation<
  T,
  TError,
  TanstackIdiomaticNativeOptions<
    Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
    Awaited<ReturnType<T>>,
    TError
  >,
  TanstackMutationReactiveNativeOptions<
    Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
    Awaited<ReturnType<T>>,
    TError
  >,
  TanstackMutationReactiveCallOptions<
    Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
    Awaited<ReturnType<T>>,
    TError
  >,
  TanstackMutationReactiveReturnType<
    Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
    Awaited<ReturnType<T>>,
    TError
  >
>;
