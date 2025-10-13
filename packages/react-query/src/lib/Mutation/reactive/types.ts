import { ReactiveMutation as CoreReactiveMutation } from '@chimeric/core';
import {
  UseMutationResult,
  UseMutationOptions,
  MutationOptions,
} from '@tanstack/react-query';

export type ReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = CoreReactiveMutation<
  TParams,
  TResult,
  TError,
  TanstackMutationReactiveNativeOptions<TParams, TResult, TError>,
  TanstackMutationReactiveInvokeOptions<TParams, TResult, TError>,
  TanstackMutationReactiveReturnType<TParams, TResult, TError>
>;

export type DefineReactiveMutation<
  T extends (
    params: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ReactiveMutation<void, Awaited<ReturnType<T>>, TError>
  : ReactiveMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;

export type TanstackMutationReactiveNativeOptions<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = Omit<UseMutationOptions<TResult, TError, TParams>, 'mutationFn'>;

export type TanstackMutationReactiveInvokeOptions<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = MutationOptions<TResult, TError, TParams>;

export type TanstackMutationReactiveReturnType<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = UseMutationResult<TResult, TError, TParams>;
