/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
} from '@tanstack/vue-query';
import {
  ReactiveMutation,
  VueMutationReactiveInvokeOptions,
  VueMutationReactiveNativeOptions,
  VueMutationReactiveReturnType,
} from './types';
import { markReactive, TYPE_MARKERS, validateMaxArgLength } from '@chimeric/core';

// Required params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & VueMutationReactiveNativeOptions<TParams, TResult, TError>,
): ReactiveMutation<TParams, TResult, TError>;

// Optional params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (params?: TParams) => Promise<TResult>;
  } & VueMutationReactiveNativeOptions<TParams | undefined, TResult, TError>,
): ReactiveMutation<TParams | undefined, TResult, TError>;

// No params
export function ReactiveMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: () => Promise<TResult>;
  } & VueMutationReactiveNativeOptions<void, TResult, TError>,
): ReactiveMutation<void, TResult, TError>;

// Implementation
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (params: TParams) => Promise<TResult>;
  } & VueMutationReactiveNativeOptions<TParams, TResult, TError>,
): ReactiveMutation<TParams, TResult, TError> {
  const { mutationFn, ...initialDefaultNativeOptions } = config;
  validateMaxArgLength({
    fn: mutationFn,
    fnName: 'mutationFn',
    maximumLength: 1,
  });

  const mutationCandidate = (
    allInitialOptions: Parameters<
      ReactiveMutation<TParams, TResult, TError>['useHook']
    >[0] = {},
  ) => {
    const { options: initialOptions, nativeOptions: initialNativeOptions } =
      allInitialOptions;
    const mutation = useMutation({
      mutationFn: mutationFn as any,
      ...initialDefaultNativeOptions,
      ...initialOptions,
      ...initialNativeOptions,
    } as any);

    return {
      invoke: (
        paramsOrOptions?: any,
        maybeOptions?: any,
      ) => {
        const params =
          mutationFn.length === 0
            ? (undefined as TParams)
            : (paramsOrOptions as TParams);
        const allOptions =
          mutationFn.length === 0
            ? (paramsOrOptions as {
                options?: Record<string | number | symbol, never>;
                nativeOptions?: VueMutationReactiveInvokeOptions<
                  TParams,
                  TResult,
                  TError
                >;
              })
            : maybeOptions;
        const nativeOptions = allOptions?.nativeOptions as
          | VueMutationReactiveNativeOptions<TParams, TResult, TError>
          | undefined;

        return mutation.mutateAsync(params as any, nativeOptions as any);
      },
      isIdle: mutation.isIdle,
      isPending: mutation.isPending,
      isSuccess: mutation.isSuccess,
      isError: mutation.isError,
      error: mutation.error,
      data: mutation.data,
      reset: mutation.reset,
      native: mutation as unknown as VueMutationReactiveReturnType<
        TParams,
        TResult,
        TError
      >,
    };
  };

  const reactiveMutation = {
    useHook: mutationCandidate,
  };

  return markReactive(
    reactiveMutation,
    TYPE_MARKERS.REACTIVE_MUTATION,
  ) as ReactiveMutation<TParams, TResult, TError>;
}
