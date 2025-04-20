export type IdiomaticMutation<
  TParams extends undefined | object,
  TResult,
> = TParams extends undefined
  ? () => Promise<TResult>
  : (params: TParams) => Promise<TResult>;

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticMutation<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>
>;
