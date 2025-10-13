export type IdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TIdiomaticNativeOptions = unknown,
> = [TParams] extends [void]
  ? (allOptions?: {
      options?: IdiomaticMutationOptions;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<TResult>
  : void extends TParams
  ? (allOptions?: {
      options?: IdiomaticMutationOptions;
      nativeOptions?: TIdiomaticNativeOptions;
    }) => Promise<TResult>
  : undefined extends TParams
  ? (
      params?: TParams,
      allOptions?: {
        options?: IdiomaticMutationOptions;
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<TResult>
  : (
      params: TParams,
      allOptions?: {
        options?: IdiomaticMutationOptions;
        nativeOptions?: TIdiomaticNativeOptions;
      },
    ) => Promise<TResult>;

export type IdiomaticMutationOptions = {
  [key: string]: never;
  [key: symbol]: never;
  [key: number]: never;
};

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TNativeOptions = unknown,
> = Parameters<T> extends []
  ? IdiomaticMutation<void, Awaited<ReturnType<T>>, TNativeOptions>
  : IdiomaticMutation<Parameters<T>[0], Awaited<ReturnType<T>>, TNativeOptions>;
