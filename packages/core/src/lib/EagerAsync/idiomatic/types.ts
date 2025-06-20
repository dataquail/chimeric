export type IdiomaticEagerAsync<TParams, TResult> = TParams extends Record<
  'options',
  unknown
>
  ? never
  : TParams extends undefined
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
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>
>;
