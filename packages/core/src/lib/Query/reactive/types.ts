export type ReactiveQueryReturn<
  TResult,
  TError extends Error,
  TNativeReturnType,
> = {
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: TError | null;
  data: TResult | undefined;
  refetch: () => Promise<TResult>;
  native: TNativeReturnType;
};

export type ReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
> = [TParams] extends [void]
  ? {
      useHook: (allOptions?: {
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>;
      usePrefetchHook: (allOptions?: {
        nativeOptions?: TNativePrefetchOptions;
      }) => void;
    }
  : [TParams] extends [undefined]
  ? {
      useHook: (allOptions?: {
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>;
      usePrefetchHook: (allOptions?: {
        nativeOptions?: TNativePrefetchOptions;
      }) => void;
    }
  : undefined extends TParams
  ? {
      useHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: TNativeOptions;
        },
      ) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>;
      usePrefetchHook: (
        params?: NonNullable<TParams>,
        allOptions?: {
          nativeOptions?: TNativePrefetchOptions;
        },
      ) => void;
    }
  : {
      useHook: (
        params: TParams,
        allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: TNativeOptions;
        },
      ) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>;
      usePrefetchHook: (
        params: TParams,
        allOptions?: {
          nativeOptions?: TNativePrefetchOptions;
        },
      ) => void;
    };

export type ReactiveQueryOptions = { enabled?: boolean };

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
  TNativePrefetchOptions = unknown,
> = Parameters<T> extends []
  ? ReactiveQuery<
      void,
      Awaited<ReturnType<T>>,
      TError,
      TNativeOptions,
      TNativeReturnType,
      TNativePrefetchOptions
    >
  : ReactiveQuery<
      Parameters<T>[0],
      Awaited<ReturnType<T>>,
      TError,
      TNativeOptions,
      TNativeReturnType,
      TNativePrefetchOptions
    >;
