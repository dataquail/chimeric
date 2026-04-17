import type { DeepReadonly, Ref } from 'vue';
import type {
  ReactiveAsyncInvokeOptions,
  ReactiveAsyncOptions,
} from '@chimeric/core';

export type VueReactiveAsyncReturn<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  invoke: [TParams] extends [void]
    ? (options?: ReactiveAsyncInvokeOptions) => Promise<TResult>
    : void extends TParams
    ? (options?: ReactiveAsyncInvokeOptions) => Promise<TResult>
    : undefined extends TParams
    ? (
        params?: TParams,
        options?: ReactiveAsyncInvokeOptions,
      ) => Promise<TResult>
    : (
        params: TParams,
        options?: ReactiveAsyncInvokeOptions,
      ) => Promise<TResult>;
  isIdle: DeepReadonly<Ref<boolean>>;
  isPending: DeepReadonly<Ref<boolean>>;
  isSuccess: DeepReadonly<Ref<boolean>>;
  isError: DeepReadonly<Ref<boolean>>;
  error: DeepReadonly<Ref<TError | null>>;
  data: DeepReadonly<Ref<TResult | undefined>>;
};

export type VueReactiveAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  useHook: (
    config?: ReactiveAsyncOptions,
  ) => VueReactiveAsyncReturn<TParams, TResult, TError>;
};

export type VueDefineReactiveAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? VueReactiveAsync<void, Awaited<ReturnType<T>>, TError>
  : VueReactiveAsync<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;

export type VueChimericAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = ((
  ...args: Parameters<
    VueReactiveAsyncReturn<TParams, TResult, TError>['invoke']
  >
) => Promise<TResult>) &
  VueReactiveAsync<TParams, TResult, TError>;

export type VueDefineChimericAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? VueChimericAsync<void, Awaited<ReturnType<T>>, TError>
  : VueChimericAsync<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
