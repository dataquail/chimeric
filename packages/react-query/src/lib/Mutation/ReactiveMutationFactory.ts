import { useMutation } from '@tanstack/react-query';
import { ReactiveMutation, isReactiveMutation } from '@chimeric/core';
import { MutationOptions, ReactiveMutationOptions } from '../types';

// Overloads
export function ReactiveMutationFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  mutationOptions: MutationOptions<void, TResult, E>,
): ReactiveMutation<void, TResult, E>;
export function ReactiveMutationFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  mutationOptions: MutationOptions<TParams, TResult, E>,
): ReactiveMutation<TParams, TResult, E>;

// Implementation
export function ReactiveMutationFactory<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  mutationOptions: MutationOptions<TParams, TResult, E>,
): ReactiveMutation<TParams, TResult, E> {
  const reactiveMutation = {
    useMutation: (config?: {
      options: ReactiveMutationOptions<TParams, TResult, E>;
    }) => {
      const mutation = useMutation<TResult, E, TParams, unknown>({
        ...mutationOptions,
        ...(config?.options ?? {}),
      });
      return {
        call: mutation.mutateAsync,
        isIdle: mutation.isIdle,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
      };
    },
  };
  if (isReactiveMutation<TParams, TResult, E>(reactiveMutation)) {
    return reactiveMutation;
  } else {
    throw new Error(
      'reactiveMutation is not qualified to be reactive mutation',
    );
  }
}
