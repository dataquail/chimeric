export type ReactiveEagerAsync<
  TParams extends undefined | object,
  TResult = unknown,
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
  : {
      useEagerAsync: (params: TParams) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult;
      };
    };

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
