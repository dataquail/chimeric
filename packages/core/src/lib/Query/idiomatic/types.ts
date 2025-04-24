export type IdiomaticQuery<
  TParams extends undefined | object,
  TResult = unknown,
  TNativeOptions = unknown,
> = TParams extends Record<'options' | 'nativeOptions', unknown>
  ? never
  : TParams extends undefined
  ? (params?: {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TNativeOptions;
    }) => Promise<TResult>
  : TParams extends object
  ? (
      params: TParams & {
        options?: IdiomaticQueryOptions;
        nativeOptions?: TNativeOptions;
      },
    ) => Promise<TResult>
  : never;

export type IdiomaticQueryOptions = { forceRefetch?: boolean };

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TNativeOptions = unknown,
> = IdiomaticQuery<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TNativeOptions
>;
