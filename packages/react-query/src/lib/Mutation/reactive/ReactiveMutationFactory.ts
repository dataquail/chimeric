import {
  MutateOptions,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  ReactiveMutation,
  TanstackMutationReactiveInvokeOptions,
  TanstackMutationReactiveNativeOptions,
} from './types';
import { createReactiveMutation } from './createReactiveMutation';
import { validateMaxArgLength } from '../../utilities/validateMaxArgLength';
import { ReactiveMutationInvokeOptions } from '@chimeric/core';

// Required params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & TanstackMutationReactiveNativeOptions<TParams, TResult, TError>,
): ReactiveMutation<TParams, TResult, TError>;

// Optional params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (params?: TParams) => Promise<TResult>;
  } & TanstackMutationReactiveNativeOptions<
    TParams | undefined,
    TResult,
    TError
  >,
): ReactiveMutation<TParams | undefined, TResult, TError>;

// No params
export function ReactiveMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: () => Promise<TResult>;
  } & TanstackMutationReactiveNativeOptions<void, TResult, TError>,
): ReactiveMutation<void, TResult, TError>;

// Implementation
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & TanstackMutationReactiveNativeOptions<TParams, TResult, TError>,
): ReactiveMutation<TParams, TResult, TError> {
  const { mutationFn, ...initialDefaultNativeOptions } = config;
  validateMaxArgLength({
    fn: mutationFn,
    fnName: 'mutationFn',
    maximumLength: 1,
  });
  const mutationCandidate = (
    allInitialOptions: Parameters<
      ReactiveMutation<TParams, TResult, TError>['use']
    >[0] = {},
  ) => {
    const { options: initialOptions, nativeOptions: initialNativeOptions } =
      allInitialOptions;
    const mutation = useMutation({
      mutationFn,
      ...initialDefaultNativeOptions,
      ...initialOptions,
      ...initialNativeOptions,
    });

    return {
      invoke: (
        paramsOrOptions?: Parameters<
          ReturnType<
            ReactiveMutation<TParams, TResult, TError>['use']
          >['invoke']
        >[0],
        maybeOptions?: Parameters<
          ReturnType<
            ReactiveMutation<TParams, TResult, TError>['use']
          >['invoke']
        >[1],
      ) => {
        const params =
          mutationFn.length === 0
            ? (undefined as TParams)
            : (paramsOrOptions as TParams);
        const allOptions =
          mutationFn.length === 0
            ? (paramsOrOptions as {
                options?: ReactiveMutationInvokeOptions;
                nativeOptions?: TanstackMutationReactiveInvokeOptions<
                  TParams,
                  TResult,
                  TError
                >;
              })
            : maybeOptions;
        const options = allOptions?.options as
          | ReactiveMutationInvokeOptions
          | undefined;
        const nativeOptions = allOptions?.nativeOptions as
          | TanstackMutationReactiveNativeOptions<TParams, TResult, TError>
          | undefined;
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
    };
  };
  return createReactiveMutation(mutationCandidate);
}
