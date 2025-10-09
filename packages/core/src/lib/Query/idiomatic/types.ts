export type IdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TIdiomaticNativeOptions = unknown,
> = [TParams] extends [void]
  ? (allOptions?: {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<TResult>
  : [TParams] extends [undefined]
  ? (allOptions?: {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<TResult>
  : undefined extends TParams
  ? (
      params?: NonNullable<TParams>,
      allOptions?: {
        options?: IdiomaticQueryOptions;
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<TResult>
  : (
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
> = Parameters<T> extends []
  ? IdiomaticQuery<void, Awaited<ReturnType<T>>, TIdiomaticNativeOptions>
  : IdiomaticQuery<
      Parameters<T>[0],
      Awaited<ReturnType<T>>,
      TIdiomaticNativeOptions
    >;
