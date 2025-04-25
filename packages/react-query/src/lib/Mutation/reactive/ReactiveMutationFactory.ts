import {
  MutateOptions,
  useMutation,
  UseMutationResult,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { ReactiveMutation } from './types';
import { createReactiveMutation } from './createReactiveMutation';

// Overloads
export function ReactiveMutationFactory<
  TResult = unknown,
  E extends Error = Error,
>(
  mutationOptions: {
    mutationFn: () => Promise<TResult>;
  } & Omit<UseMutationOptions<TResult, E, undefined>, 'mutationFn'>,
): ReactiveMutation<undefined, TResult, E>;
export function ReactiveMutationFactory<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  mutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & Omit<UseMutationOptions<TResult, E, TParams>, 'mutationFn'>,
): ReactiveMutation<TParams, TResult, E>;

// Implementation
export function ReactiveMutationFactory<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveMutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & Omit<UseMutationOptions<TResult, E, TParams>, 'mutationFn'>,
): ReactiveMutation<undefined, TResult, E> {
  return createReactiveMutation((reactiveAndNativeOptions) => {
    const { options, nativeOptions } = reactiveAndNativeOptions ?? {};
    const mutation = useMutation({
      ...reactiveMutationOptions,
      ...options,
      ...(nativeOptions as Omit<
        UseMutationOptions<TResult, E, TParams>,
        'mutationFn'
      >),
    });

    return {
      call: (paramsAndOptions) => {
        const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
        return mutation.mutateAsync(
          params as TParams,
          nativeOptions as MutateOptions<TResult, E, TParams>,
        );
      },
      isIdle: mutation.isIdle,
      isPending: mutation.isPending,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      error: mutation.error,
      data: mutation.data,
      reset: mutation.reset,
      native: mutation as unknown as UseMutationResult<TResult, E, undefined>,
    };
  });
}
