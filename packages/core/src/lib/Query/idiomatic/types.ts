export type IdiomaticQuery<TParams, TResult> = TParams extends Record<
  'options',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>
  ? never
  : TParams extends void
  ? (params?: { options: IdiomaticQueryOptions }) => Promise<TResult>
  : TParams extends object
  ? (params: TParams & { options?: IdiomaticQueryOptions }) => Promise<TResult>
  : never;

export type IdiomaticQueryOptions = { forceRefetch?: boolean };

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticQuery<Parameters<T>[0], Awaited<ReturnType<T>>>;
