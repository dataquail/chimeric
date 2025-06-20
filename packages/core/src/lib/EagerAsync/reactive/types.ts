export type ReactiveEagerAsync<
  TParams,
  TResult,
  E extends Error = Error,
> = TParams extends Record<'options', unknown>
  ? never
  : TParams extends undefined
  ? {
      useEagerAsync: () => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
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
        error: E | null;
        data: TResult;
      };
    }
  : TParams extends unknown
  ? {
      useEagerAsync: () => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult;
      };
    }
  : never;

export type DefineReactiveEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveEagerAsync<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;
