export type ReactiveAsync<
  TParams,
  TResult,
  E extends Error = Error,
> = TParams extends Record<'options', unknown>
  ? never
  : TParams extends undefined
  ? {
      useAsync: (config?: ReactiveAsyncOptions) => {
        call: () => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : TParams extends object
  ? {
      useAsync: (config?: ReactiveAsyncOptions) => {
        call: (params: TParams) => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : TParams extends unknown
  ? {
      useAsync: (config?: ReactiveAsyncOptions) => {
        call: () => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : never;

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
