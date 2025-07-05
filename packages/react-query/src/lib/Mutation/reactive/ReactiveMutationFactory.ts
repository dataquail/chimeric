import {
  MutateOptions,
  useMutation,
  UseMutationResult,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { ReactiveMutation } from './types';
import { createReactiveMutation } from './createReactiveMutation';

export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  reactiveMutationOptions: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & Omit<UseMutationOptions<TResult, TError, TParams>, 'mutationFn'>,
): ReactiveMutation<
  TParams extends undefined ? void : TParams,
  TResult,
  TError
> {
  return createReactiveMutation<TParams, TResult, TError>(
    (reactiveAndNativeOptions) => {
      const { options, nativeOptions } = reactiveAndNativeOptions ?? {};
      const mutation = useMutation({
        ...reactiveMutationOptions,
        ...options,
        ...nativeOptions,
      });

      return {
        invoke: (
          paramsAndOptions: Parameters<
            ReturnType<
              ReactiveMutation<TResult, TParams, TError>['use']
            >['invoke']
          >[0],
        ) => {
          const { options, nativeOptions, ...params } = paramsAndOptions ?? {};
          return mutation.mutateAsync(params as TParams, {
            ...options,
            ...(nativeOptions as MutateOptions<TResult, TError, TParams>),
          });
        },
        isIdle: mutation.isIdle,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
        native: mutation as unknown as UseMutationResult<
          TResult,
          TError,
          TParams
        >,
      } as ReturnType<ReactiveMutation<TParams, TResult, TError>['use']>;
    },
  ) as ReactiveMutation<
    TParams extends undefined ? void : TParams,
    TResult,
    TError
  >;
}
