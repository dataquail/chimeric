import type { Ref, ComputedRef } from 'vue';
import {
  UseMutationReturnType,
  UseMutationOptions,
  MutationOptions,
} from '@tanstack/vue-query';

// Vue-specific reactive mutation return - uses refs instead of plain values
export type VueMutationReactiveReturn<TParams, TResult, TError extends Error, TNativeReturnType> = {
  invoke: [TParams] extends [void]
    ? (allInvokeOptions?: {
        options?: Record<string | number | symbol, never>;
        nativeOptions?: VueMutationReactiveInvokeOptions<TParams, TResult, TError>;
      }) => Promise<TResult>
    : void extends TParams
    ? (allInvokeOptions?: {
        options?: Record<string | number | symbol, never>;
        nativeOptions?: VueMutationReactiveInvokeOptions<TParams, TResult, TError>;
      }) => Promise<TResult>
    : undefined extends TParams
    ? (
        params?: TParams,
        allInvokeOptions?: {
          options?: Record<string | number | symbol, never>;
          nativeOptions?: VueMutationReactiveInvokeOptions<TParams, TResult, TError>;
        },
      ) => Promise<TResult>
    : (
        params: TParams,
        allInvokeOptions?: {
          options?: Record<string | number | symbol, never>;
          nativeOptions?: VueMutationReactiveInvokeOptions<TParams, TResult, TError>;
        },
      ) => Promise<TResult>;
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
  error: Ref<TError | null>;
  data: Ref<TResult | undefined>;
  reset: () => void;
  native: TNativeReturnType;
};

// Vue-specific ReactiveMutation type
export type ReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  useHook: (allOptions?: {
    options?: Record<string | number | symbol, never>;
    nativeOptions?: VueMutationReactiveNativeOptions<TParams, TResult, TError>;
  }) => VueMutationReactiveReturn<
    TParams,
    TResult,
    TError,
    VueMutationReactiveReturnType<TParams, TResult, TError>
  >;
};

export type DefineReactiveMutation<
  T extends (
    params: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ReactiveMutation<void, Awaited<ReturnType<T>>, TError>
  : ReactiveMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;

export type VueMutationReactiveNativeOptions<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = Omit<UseMutationOptions<TResult, TError, TParams>, 'mutationFn'>;

export type VueMutationReactiveInvokeOptions<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = MutationOptions<TResult, TError, TParams>;

export type VueMutationReactiveReturnType<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = UseMutationReturnType<TResult, TError, TParams, unknown>;
