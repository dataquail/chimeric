export type IdiomaticEagerAsync<
  TParams = void,
  TResult = unknown,
> = TParams extends void
  ? () => Promise<TResult>
  : TParams extends object
  ? (params: TParams) => Promise<TResult>
  : TParams extends unknown
  ? () => Promise<TResult>
  : never;

export type DefineIdiomaticEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticEagerAsync<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>
>;
