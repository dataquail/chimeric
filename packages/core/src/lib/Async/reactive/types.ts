export type ReactiveAsync<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = TParams extends Record<'options', any>
  ? never
  : {
      useAsync: (options?: ReactiveAsyncOptions) => {
        call: TParams extends void
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Parameters<T>[0] extends Record<'options', any>
      ? never
      : Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveAsync<
  Parameters<T>[0] extends void
    ? void
    : Parameters<T>[0] extends object
    ? Parameters<T>[0]
    : never,
  Awaited<ReturnType<T>>,
  E
>;
