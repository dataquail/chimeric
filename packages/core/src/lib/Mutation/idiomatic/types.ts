export type IdiomaticMutation<
  TParams = void,
  TResult = unknown,
  TIdiomaticNativeOptions = unknown,
> = TParams extends object
  ? Omit<TParams, 'options' | 'nativeOptions'> extends
      | undefined
      | {
          options?: IdiomaticMutationOptions;
          nativeOptions?: TIdiomaticNativeOptions;
        }
    ? (config?: {
        options?: IdiomaticMutationOptions;
        nativeOptions?: TIdiomaticNativeOptions;
      }) => Promise<TResult>
    : (
        paramsAndConfig: TParams & {
          options?: IdiomaticMutationOptions;
          nativeOptions?: TIdiomaticNativeOptions;
        },
      ) => Promise<TResult>
  : TParams extends void
  ? (
      config?:
        | {
            options?: IdiomaticMutationOptions;
            nativeOptions?: TIdiomaticNativeOptions;
          }
        | TParams,
    ) => Promise<TResult>
  : never;

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
> = IdiomaticMutation<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TNativeOptions
>;
