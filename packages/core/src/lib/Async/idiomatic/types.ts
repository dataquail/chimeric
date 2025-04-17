export type IdiomaticAsync<
  TParams extends void | object,
  TResult = unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = TParams extends Record<'options', any>
  ? never
  : TParams extends void
  ? (params?: { options: IdiomaticAsyncOptions }) => Promise<TResult>
  : TParams extends object
  ? (params: TParams & { options?: IdiomaticAsyncOptions }) => Promise<TResult>
  : never;

export type IdiomaticAsyncOptions = {
  retry?: number;
};

export type DefineIdiomaticAsync<
  T extends (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Parameters<T>[0] extends Record<'options', any>
      ? never
      : Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticAsync<
  Parameters<T>[0] extends void
    ? void
    : Parameters<T>[0] extends object
    ? Parameters<T>[0]
    : never,
  Awaited<ReturnType<T>>
>;
