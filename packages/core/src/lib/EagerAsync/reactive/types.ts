export type ReactiveEagerAsyncReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = {
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: TError | null;
  data: TResult | undefined;
};

export type ReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  use: [TParams] extends [void]
    ? (
        config?: ReactiveEagerAsyncOptions,
      ) => ReactiveEagerAsyncReturnType<TResult, TError>
    : void extends TParams
    ? (
        config?: ReactiveEagerAsyncOptions,
      ) => ReactiveEagerAsyncReturnType<TResult, TError>
    : undefined extends TParams
    ? (
        params?: TParams,
        config?: ReactiveEagerAsyncOptions,
      ) => ReactiveEagerAsyncReturnType<TResult, TError>
    : (
        params: TParams,
        config?: ReactiveEagerAsyncOptions,
      ) => ReactiveEagerAsyncReturnType<TResult, TError>;
};

export type ReactiveEagerAsyncOptions = Record<string, never>;

export type DefineReactiveEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ReactiveEagerAsync<void, Awaited<ReturnType<T>>, TError>
  : ReactiveEagerAsync<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
