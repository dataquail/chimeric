export type ReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = TParams extends void
  ? {
      useEagerAsync: () => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: TError | null;
        data: TResult;
      };
    }
  : TParams extends object
  ? {
      useEagerAsync: (params: TParams) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: TError | null;
        data: TResult;
      };
    }
  : never;

export type DefineReactiveEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
> = ReactiveEagerAsync<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TError
>;
