import {
  IdiomaticMutationOptions,
  createIdiomaticMutation as coreCreateIdiomaticMutation,
} from '@chimeric/core';
import { IdiomaticMutation } from './types';
import { MutationOptions } from '@tanstack/react-query';

// Overloads
export function createIdiomaticMutation<
  TResult = unknown,
  E extends Error = Error,
>(
  idiomaticFn: (params?: {
    options?: IdiomaticMutationOptions;
    nativeOptions?: Omit<MutationOptions<TResult, E, undefined>, 'mutationFn'>;
  }) => Promise<TResult>,
): IdiomaticMutation<undefined, TResult, E>;
export function createIdiomaticMutation<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticMutationOptions;
      nativeOptions?: Omit<MutationOptions<TResult, E, TParams>, 'mutationFn'>;
    },
  ) => Promise<TResult>,
): IdiomaticMutation<TParams, TResult, E>;

// Implementation
export function createIdiomaticMutation<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(
  idiomaticFn: (
    params: TParams & {
      options?: IdiomaticMutationOptions;
      nativeOptions?: Omit<MutationOptions<TResult, E, TParams>, 'mutationFn'>;
    },
  ) => ReturnType<IdiomaticMutation<TParams, TResult, E>>,
): IdiomaticMutation<TParams, TResult, E> {
  return coreCreateIdiomaticMutation(idiomaticFn) as IdiomaticMutation<
    TParams,
    TResult,
    E
  >;
}
