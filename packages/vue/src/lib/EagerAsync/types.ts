import type { DeepReadonly, Ref } from 'vue';
import type { IdiomaticEagerAsync, ReactiveEagerAsyncOptions } from '@chimeric/core';

export type VueReactiveEagerAsyncReturn<
  TResult = unknown,
  TError extends Error = Error,
> = {
  isIdle: DeepReadonly<Ref<boolean>>;
  isPending: DeepReadonly<Ref<boolean>>;
  isSuccess: DeepReadonly<Ref<boolean>>;
  isError: DeepReadonly<Ref<boolean>>;
  error: DeepReadonly<Ref<TError | null>>;
  data: DeepReadonly<Ref<TResult | undefined>>;
};

export type VueReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  useHook: [TParams] extends [void]
    ? (
        options?: ReactiveEagerAsyncOptions,
      ) => VueReactiveEagerAsyncReturn<TResult, TError>
    : void extends TParams
    ? (
        options?: ReactiveEagerAsyncOptions,
      ) => VueReactiveEagerAsyncReturn<TResult, TError>
    : undefined extends TParams
    ? (
        params?: TParams,
        options?: ReactiveEagerAsyncOptions,
      ) => VueReactiveEagerAsyncReturn<TResult, TError>
    : (
        params: TParams,
        options?: ReactiveEagerAsyncOptions,
      ) => VueReactiveEagerAsyncReturn<TResult, TError>;
};

export type VueDefineReactiveEagerAsync<
  T extends (
    params: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? VueReactiveEagerAsync<void, Awaited<ReturnType<T>>, TError>
  : VueReactiveEagerAsync<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;

export type VueChimericEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = IdiomaticEagerAsync<TParams, TResult> &
  VueReactiveEagerAsync<TParams, TResult, TError>;

export type VueDefineChimericEagerAsync<
  T extends (
    params: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? VueChimericEagerAsync<void, Awaited<ReturnType<T>>, TError>
  : VueChimericEagerAsync<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
