import { ReactiveMutation as CoreReactiveMutation } from '@chimeric/core';
import {
  CreateMutationResult,
  CreateMutationOptions,
  MutationOptions,
} from '@tanstack/svelte-query';

export type ReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = CoreReactiveMutation<
  TParams,
  TResult,
  TError,
  SvelteMutationReactiveNativeOptions<TParams, TResult, TError>,
  SvelteMutationReactiveInvokeOptions<TParams, TResult, TError>,
  SvelteMutationReactiveReturnType<TParams, TResult, TError>
>;

export type DefineReactiveMutation<
  T extends (
    params: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ReactiveMutation<void, Awaited<ReturnType<T>>, TError>
  : ReactiveMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;

export type SvelteMutationReactiveNativeOptions<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = Omit<CreateMutationOptions<TResult, TError, TParams>, 'mutationFn'>;

export type SvelteMutationReactiveInvokeOptions<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = MutationOptions<TResult, TError, TParams>;

export type SvelteMutationReactiveReturnType<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = CreateMutationResult<TResult, TError, TParams>;
