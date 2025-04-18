export type IdiomaticMutation<
  TParams extends void | object,
  TResult,
> = TParams extends void
  ? () => Promise<TResult>
  : (params: TParams) => Promise<TResult>;

export type DefineIdiomaticMutation<
  T extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Parameters<T>[0] extends Record<'options', any>
      ? never
      : Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticMutation<
  Parameters<T>[0] extends void
    ? void
    : Parameters<T>[0] extends object
    ? Parameters<T>[0]
    : never,
  Awaited<ReturnType<T>>
>;
