export type IdiomaticEagerAsync<TParams = void, TResult = unknown> = [
  TParams,
] extends [void]
  ? (options?: IdiomaticEagerAsyncOptions) => Promise<TResult>
  : void extends TParams
  ? (options?: IdiomaticEagerAsyncOptions) => Promise<TResult>
  : undefined extends TParams
  ? (params?: TParams, options?: IdiomaticEagerAsyncOptions) => Promise<TResult>
  : (params: TParams, options?: IdiomaticEagerAsyncOptions) => Promise<TResult>;

export type IdiomaticEagerAsyncOptions = Record<string, never>;

export type DefineIdiomaticEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = Parameters<T> extends []
  ? IdiomaticEagerAsync<void, Awaited<ReturnType<T>>>
  : IdiomaticEagerAsync<Parameters<T>[0], Awaited<ReturnType<T>>>;
