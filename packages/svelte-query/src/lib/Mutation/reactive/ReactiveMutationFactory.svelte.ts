/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type MutationFunctionContext,
  createMutation,
  type QueryClient,
} from '@tanstack/svelte-query';
import {
  ReactiveMutation,
  SvelteMutationReactiveInvokeOptions,
  SvelteMutationReactiveNativeOptions,
} from './types';
import { createReactiveMutation } from './createReactiveMutation';
import {
  ReactiveMutationInvokeOptions,
  validateMaxArgLength,
} from '@chimeric/core';

// Required params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (
      params: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
    queryClient?: QueryClient;
  } & SvelteMutationReactiveNativeOptions<TParams, TResult, TError>,
): ReactiveMutation<TParams, TResult, TError>;

// Optional params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (
      params?: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
    queryClient?: QueryClient;
  } & SvelteMutationReactiveNativeOptions<TParams | undefined, TResult, TError>,
): ReactiveMutation<TParams | undefined, TResult, TError>;

// No params
export function ReactiveMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (context?: MutationFunctionContext) => Promise<TResult>;
    queryClient?: QueryClient;
  } & SvelteMutationReactiveNativeOptions<void, TResult, TError>,
): ReactiveMutation<void, TResult, TError>;

// Implementation
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (
      params: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
    queryClient?: QueryClient;
  } & SvelteMutationReactiveNativeOptions<TParams, TResult, TError>,
): ReactiveMutation<TParams, TResult, TError> {
  const { mutationFn, queryClient, ...initialDefaultNativeOptions } = config;
  validateMaxArgLength({
    fn: mutationFn,
    fnName: 'mutationFn',
    maximumLength: 2,
  });
  const mutationCandidate = (
    allInitialOptions: Parameters<
      ReactiveMutation<TParams, TResult, TError>['useHook']
    >[0] = {},
  ) => {
    const { options: initialOptions, nativeOptions: initialNativeOptions } =
      allInitialOptions;

    const mutation = createMutation(
      () => ({
        mutationFn: (variables: TParams) => mutationFn(variables),
        ...initialDefaultNativeOptions,
        ...initialOptions,
        ...initialNativeOptions,
      }),
      queryClient ? () => queryClient : undefined,
    );

    return {
      invoke: (
        paramsOrOptions?: Parameters<
          ReturnType<
            ReactiveMutation<TParams, TResult, TError>['useHook']
          >['invoke']
        >[0],
        maybeOptions?: Parameters<
          ReturnType<
            ReactiveMutation<TParams, TResult, TError>['useHook']
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
                nativeOptions?: SvelteMutationReactiveInvokeOptions<
                  TParams,
                  TResult,
                  TError
                >;
              })
            : maybeOptions;
        const nativeOptions = allOptions?.nativeOptions as
          | SvelteMutationReactiveNativeOptions<TParams, TResult, TError>
          | undefined;
        return mutation.mutateAsync(params as TParams, {
          ...(nativeOptions as any),
        });
      },
      get isIdle() {
        return mutation.isIdle;
      },
      get isPending() {
        return mutation.isPending;
      },
      get isSuccess() {
        return mutation.isSuccess;
      },
      get isError() {
        return mutation.isError;
      },
      get error() {
        return mutation.error as TError | null;
      },
      get data() {
        return mutation.data as TResult | undefined;
      },
      reset: () => mutation.reset(),
      get native() {
        return mutation as any;
      },
    };
  };
  return createReactiveMutation(
    mutationCandidate,
  ) as unknown as ReactiveMutation<TParams, TResult, TError>;
}
