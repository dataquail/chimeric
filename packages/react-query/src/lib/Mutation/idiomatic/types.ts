import {
  IdiomaticMutation as CoreIdiomaticMutation,
  DefineIdiomaticMutation as CoreDefineIdiomaticMutation,
} from '@chimeric/core';
import { MutationOptions } from '@tanstack/react-query';

export type IdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = CoreIdiomaticMutation<
  TParams,
  TResult,
  TanstackIdiomaticNativeOptions<TParams, TResult, TError>
>;

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = CoreDefineIdiomaticMutation<
  T,
  TanstackIdiomaticNativeOptions<
    Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
    Awaited<ReturnType<T>>,
    TError
  >
>;

export type TanstackIdiomaticNativeOptions<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = Omit<MutationOptions<TResult, TError, TParams>, 'mutationFn'>;
