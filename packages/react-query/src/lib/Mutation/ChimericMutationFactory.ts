import { QueryClient } from '@tanstack/react-query';
import { ChimericMutation, fuseChimericMutation } from '@chimeric/core';
import { MutationOptions } from '../types';
import { IdiomaticMutationFactory } from './IdiomaticMutationFactory';
import { ReactiveMutationFactory } from './ReactiveMutationFactory';

// Overloads
export function ChimericMutationFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: MutationOptions<undefined, TResult, E>,
): ChimericMutation<undefined, TResult, E>;
export function ChimericMutationFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: MutationOptions<TParams, TResult, E>,
): ChimericMutation<TParams, TResult, E>;

// Implementation
export function ChimericMutationFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  queryClient: QueryClient,
  mutationOptions: MutationOptions<TParams, TResult, E>,
): ChimericMutation<TParams, TResult, E> {
  return fuseChimericMutation({
    idiomatic: IdiomaticMutationFactory(
      queryClient,
      mutationOptions as MutationOptions<void, TResult, E>,
    ),
    reactive: ReactiveMutationFactory(
      mutationOptions as MutationOptions<void, TResult, E>,
    ),
  }) as ChimericMutation<TParams, TResult, E>;
}
