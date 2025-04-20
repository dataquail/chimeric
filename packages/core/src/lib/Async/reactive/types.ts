export type ReactiveAsync<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
> = TParams extends Record<'options', unknown>
  ? never
  : {
      useAsync: (options?: ReactiveAsyncOptions) => {
        call: TParams extends undefined
          ? () => Promise<TResult>
          : (params: TParams) => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    };

export type ReactiveAsyncOptions = {
  retry?: number;
};

export type DefineReactiveAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveAsync<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;
