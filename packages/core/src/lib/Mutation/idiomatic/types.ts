export type IdiomaticMutation<
  TParams extends undefined | object,
  TResult,
  TIdiomaticNativeOptions = unknown,
> = TParams extends Record<'options' | 'nativeOptions', unknown>
  ? never
  : TParams extends undefined
  ? (params?: {
      options?: IdiomaticMutationOptions;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<TResult>
  : (
      params: TParams & {
        options?: IdiomaticMutationOptions;
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<TResult>;

export type IdiomaticMutationOptions = {};

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TNativeOptions = unknown,
> = IdiomaticMutation<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TNativeOptions
>;
