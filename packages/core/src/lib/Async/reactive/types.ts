export type ReactiveAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  useAsync: (config?: ReactiveAsyncOptions) => {
    invoke: TParams extends object
      ? Omit<TParams, 'options'> extends
          | undefined
          | { options?: ReactiveAsyncInvokeOptions }
        ? (config?: {
            options?: ReactiveAsyncInvokeOptions;
          }) => Promise<TResult>
        : (
            paramsAndConfig: TParams & { options?: ReactiveAsyncInvokeOptions },
          ) => Promise<TResult>
      : TParams extends void
      ? (config?: { options?: ReactiveAsyncInvokeOptions }) => Promise<TResult>
      : never;
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
> = ReactiveAsync<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TError
>;
