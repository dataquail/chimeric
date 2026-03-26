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
> = [TParams] extends [void]
  ? {
      useHook: (allOptions?: {
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>;
    }
  : [TParams] extends [undefined]
  ? {
      useHook: (allOptions?: {
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>;
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
    }
  : {
      useHook: (
        params: TParams,
        allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: TNativeOptions;
        },
      ) => ReactiveQueryReturn<TResult, TError, TNativeReturnType>;
    };

export type ReactiveQueryOptions = { enabled?: boolean };

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = Parameters<T> extends []
  ? ReactiveQuery<
      void,
      Awaited<ReturnType<T>>,
      TError,
      TNativeOptions,
      TNativeReturnType
    >
  : ReactiveQuery<
      Parameters<T>[0],
      Awaited<ReturnType<T>>,
      TError,
      TNativeOptions,
      TNativeReturnType
    >;
