export type ReactiveAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  use: (config?: ReactiveAsyncOptions) => {
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
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: TError | null;
    data: TResult | undefined;
  };
};

export type ReactiveAsyncInvokeOptions = {
  retry?: number;
};

export type ReactiveAsyncOptions = {
  retry?: number;
};

export type DefineReactiveAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = Parameters<T> extends []
  ? ReactiveAsync<void, Awaited<ReturnType<T>>, TError>
  : ReactiveAsync<Parameters<T>[0], Awaited<ReturnType<T>>, TError>;
