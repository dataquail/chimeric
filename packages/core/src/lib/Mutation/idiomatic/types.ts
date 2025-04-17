export type IdiomaticMutation<TParams, TResult> = TParams extends void
  ? () => Promise<TResult>
  : TParams extends object
  ? (params: TParams) => Promise<TResult>
  : never;

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticMutation<Parameters<T>[0], Awaited<ReturnType<T>>>;
