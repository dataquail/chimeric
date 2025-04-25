import {
  IdiomaticMutation as CoreIdiomaticMutation,
  DefineIdiomaticMutation as CoreDefineIdiomaticMutation,
} from '@chimeric/core';
import { MutationOptions } from '@tanstack/react-query';

export type IdiomaticMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error = Error,
> = CoreIdiomaticMutation<
  TParams,
  TResult,
  Omit<MutationOptions<TResult, E, TParams>, 'mutationFn'>
>;

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = CoreDefineIdiomaticMutation<
  T,
  Omit<
    MutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>,
    'mutationFn'
  >
>;
