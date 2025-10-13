export type IdiomaticAsync<TParams = void, TResult = unknown> = [
  TParams,
] extends [void]
  ? (options?: IdiomaticAsyncOptions) => Promise<TResult>
  : void extends TParams
  ? (options?: IdiomaticAsyncOptions) => Promise<TResult>
  : undefined extends TParams
  ? (params?: TParams, options?: IdiomaticAsyncOptions) => Promise<TResult>
  : (params: TParams, options?: IdiomaticAsyncOptions) => Promise<TResult>;

export type IdiomaticAsyncOptions = {
  retry?: number;
};

export type DefineIdiomaticAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = Parameters<T> extends []
  ? IdiomaticAsync<void, Awaited<ReturnType<T>>>
  : IdiomaticAsync<Parameters<T>[0], Awaited<ReturnType<T>>>;
