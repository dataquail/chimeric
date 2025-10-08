export type IdiomaticEagerAsync<TParams = void, TResult = unknown> = (
  params: TParams,
) => Promise<TResult>;

export type DefineIdiomaticEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticEagerAsync<
  Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
  Awaited<ReturnType<T>>
>;
