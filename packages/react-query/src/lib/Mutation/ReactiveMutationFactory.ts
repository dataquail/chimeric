import { useMutation } from '@tanstack/react-query';
import { createReactiveMutation, ReactiveMutation } from '@chimeric/core';
import { MutationOptions, ReactiveMutationOptions } from '../types';

export const ReactiveMutationFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  mutationOptions: MutationOptions<TParams, TResult, E>,
): ReactiveMutation<TParams, TResult, E> => {
  return createReactiveMutation(
    (config?: { options: ReactiveMutationOptions<TParams, TResult, E> }) => {
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
  );
};
