export type ReactiveMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = TParams extends Record<'options' | 'nativeOptions', unknown>
  ? never
  : {
      useMutation: (config?: {
        options?: ReactiveMutationOptions;
        nativeOptions?: TNativeReactiveOptions;
      }) => {
        call: TParams extends undefined
          ? (params?: {
              options?: ReactiveMutationCallOptions;
              nativeOptions?: TNativeCallOptions;
            }) => Promise<TResult>
          : (
              params: TParams & {
                options?: ReactiveMutationCallOptions;
                nativeOptions?: TNativeCallOptions;
              },
            ) => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
        reset: () => void;
        native: TNativeReturnType;
      };
    };

export type ReactiveMutationOptions = {};

export type ReactiveMutationCallOptions = {};

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = ReactiveMutation<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E,
  TNativeOptions,
  TNativeCallOptions,
  TNativeReturnType
>;
