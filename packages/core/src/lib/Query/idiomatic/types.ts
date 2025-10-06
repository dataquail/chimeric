export type IdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TIdiomaticNativeOptions = unknown,
> = (
  params: TParams,
  allOptions?: {
    options?: IdiomaticQueryOptions;
    nativeOptions?: TIdiomaticNativeOptions;
  },
) => Promise<TResult>;

export type IdiomaticQueryOptions = { forceRefetch?: boolean };

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TIdiomaticNativeOptions = unknown,
> = IdiomaticQuery<
  Parameters<T>[0] extends undefined ? void : Parameters<T>[0],
  Awaited<ReturnType<T>>,
  TIdiomaticNativeOptions
>;
