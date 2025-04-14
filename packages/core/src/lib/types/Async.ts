export type IdiomaticAsync<TParams, TResult> = TParams extends void
  ? () => Promise<TResult>
  : TParams extends object
  ? (params: TParams) => Promise<TResult>
  : never;

export type ReactiveAsync<
  TParams,
  TResult,
  E extends Error,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = TParams extends Record<'options', any>
  ? never
  : TParams extends void
  ? {
      useAsync: (params?: { options: ReactiveAsyncOptions }) => {
        call: (params: TParams) => Promise<TResult>; // Need to pass params: TParams for type inference on fuseChimericAsync to work properly
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
      useAsync: (params: TParams & { options?: ReactiveAsyncOptions }) => {
        call: (params: TParams) => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : never;

export type ChimericAsync<
  TParams,
  TResult,
  E extends Error = Error,
> = IdiomaticAsync<TParams, TResult> & ReactiveAsync<TParams, TResult, E>;

export type ReactiveAsyncOptions = { isEager?: boolean };

export type DefineChimericAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericAsync<Parameters<T>[0], Awaited<ReturnType<T>>, E>;

export type DefineIdiomaticAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticAsync<Parameters<T>[0], Awaited<ReturnType<T>>>;

export type DefineReactiveAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveAsync<Parameters<T>[0], Awaited<ReturnType<T>>, E>;
