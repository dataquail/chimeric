import {
  type ChimericMutation as CoreChimericMutation,
  type DefineChimericMutation as CoreDefineChimericMutation,
} from '@chimeric/core';

import {
  type UseMutationOptions,
  type UseMutationResult,
  type MutationOptions,
} from '@tanstack/react-query';

export type ChimericMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error,
> = CoreChimericMutation<
  TParams,
  TResult,
  E,
  MutationOptions<TResult, E, TParams>,
  Omit<UseMutationOptions<TResult, E, TParams>, 'mutationFn'>,
  UseMutationResult<TResult, E>
>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = CoreDefineChimericMutation<
  T,
  E,
  MutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>,
  Omit<
    UseMutationOptions<Awaited<ReturnType<T>>, E, Parameters<T>[0]>,
    'mutationFn'
  >,
  UseMutationResult<Awaited<ReturnType<T>>, E>
>;
