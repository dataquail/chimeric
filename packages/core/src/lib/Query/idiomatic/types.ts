export type IdiomaticQuery<
  TParams = void,
  TResult = unknown,
  TIdiomaticNativeOptions = unknown,
> = TParams extends object
  ? Omit<TParams, 'options' | 'nativeOptions'> extends
      | undefined
      | {
          options?: IdiomaticQueryOptions;
          nativeOptions?: TIdiomaticNativeOptions;
        }
    ? (params?: {
        options?: IdiomaticQueryOptions;
        nativeOptions?: TIdiomaticNativeOptions;
      }) => Promise<TResult>
    : (
        paramsAndConfig: TParams & {
          options?: IdiomaticQueryOptions;
          nativeOptions?: TIdiomaticNativeOptions;
        },
      ) => Promise<TResult>
  : TParams extends void
  ? (params?: {
      options?: IdiomaticQueryOptions;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<TResult>
  : never;

export type IdiomaticQueryOptions = { forceRefetch?: boolean };

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TIdiomaticNativeOptions = unknown,
> = IdiomaticQuery<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TIdiomaticNativeOptions
>;
