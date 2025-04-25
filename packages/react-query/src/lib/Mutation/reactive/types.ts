import {
  ReactiveMutation as CoreReactiveMutation,
  DefineReactiveMutation as CoreDefineReactiveMutation,
} from '@chimeric/core';
import {
  UseMutationResult,
  UseMutationOptions,
  MutationOptions,
} from '@tanstack/react-query';

export type ReactiveMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error,
> = CoreReactiveMutation<
  TParams,
  TResult,
  E,
  Omit<UseMutationOptions<TResult, E, TParams>, 'mutationFn'>,
  MutationOptions<TResult, E, TParams>,
  UseMutationResult<TResult, E, TParams>
>;

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = CoreDefineReactiveMutation<
  T,
  E,
  Omit<
    UseMutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>,
    'mutationFn'
  >,
  MutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>,
  UseMutationResult<Awaited<ReturnType<T>>, E, Parameters<T>[0]>
>;
