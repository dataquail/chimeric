import type { Ref, ComputedRef } from 'vue';
import {
  type UseQueryOptions,
  type UseQueryReturnType,
  type QueryKey,
  type FetchQueryOptions,
} from '@tanstack/vue-query';

// Vue-specific reactive query return - uses refs instead of plain values
export type VueQueryReactiveReturn<TResult, TError, TNativeReturnType> = {
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
  error: Ref<TError | null>;
  data: Ref<TResult | undefined>;
  refetch: () => Promise<TResult>;
  native: TNativeReturnType;
};

// Vue-specific ReactiveQuery type
export type ReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = [TParams] extends [void]
  ? {
      useHook: (allOptions?: {
        options?: { enabled?: boolean };
        nativeOptions?: VueQueryReactiveNativeOptions<TResult, TError>;
      }) => VueQueryReactiveReturn<
        TResult,
        TError,
        VueQueryReactiveReturnType<TResult, TError>
      >;
      usePrefetchHook: (allOptions?: {
        nativeOptions?: VueQueryReactivePrefetchNativeOptions<TResult, TError>;
      }) => void;
    }
  : [TParams] extends [undefined]
  ? {
      useHook: (allOptions?: {
        options?: { enabled?: boolean };
        nativeOptions?: VueQueryReactiveNativeOptions<TResult, TError>;
      }) => VueQueryReactiveReturn<
        TResult,
        TError,
        VueQueryReactiveReturnType<TResult, TError>
      >;
      usePrefetchHook: (allOptions?: {
        nativeOptions?: VueQueryReactivePrefetchNativeOptions<TResult, TError>;
      }) => void;
    }
  : undefined extends TParams
  ? {
      useHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          options?: { enabled?: boolean };
          nativeOptions?: VueQueryReactiveNativeOptions<TResult, TError>;
        },
      ) => VueQueryReactiveReturn<
        TResult,
        TError,
        VueQueryReactiveReturnType<TResult, TError>
      >;
      usePrefetchHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          nativeOptions?: VueQueryReactivePrefetchNativeOptions<TResult, TError>;
        },
      ) => void;
    }
  : {
      useHook: (
        params: TParams,
        allOptions?: {
          options?: { enabled?: boolean };
          nativeOptions?: VueQueryReactiveNativeOptions<TResult, TError>;
        },
      ) => VueQueryReactiveReturn<
        TResult,
        TError,
        VueQueryReactiveReturnType<TResult, TError>
      >;
      usePrefetchHook: (
        params: TParams,
        allOptions?: {
          nativeOptions?: VueQueryReactivePrefetchNativeOptions<TResult, TError>;
        },
      ) => void;
    };

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TQueryKey extends QueryKey = QueryKey,
> = Parameters<T> extends []
  ? ReactiveQuery<void, Awaited<ReturnType<T>>, TError, TQueryKey>
  : ReactiveQuery<Parameters<T>[0], Awaited<ReturnType<T>>, TError, TQueryKey>;

export type VueQueryReactiveNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
> = Omit<
  UseQueryOptions<TResult, TError, TResult, TResult, QueryKey>,
  'queryKey' | 'queryFn'
>;

export type VueQueryReactiveReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = UseQueryReturnType<TResult, TError>;

export type VueQueryReactivePrefetchNativeOptions<
  TResult = unknown,
  TError extends Error = Error,
> = Omit<
  FetchQueryOptions<TResult, TError, TResult, QueryKey>,
  'queryKey' | 'queryFn'
>;
