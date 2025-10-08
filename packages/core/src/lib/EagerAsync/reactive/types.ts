export type ReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  use: (params: TParams) => {
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: TError | null;
    data: TResult | undefined;
  };
};

export type DefineReactiveEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = ReactiveEagerAsync<
  Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
  Awaited<ReturnType<T>>,
  TError
>;
