export type ReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = {
  useMutation: (config?: {
    options?: ReactiveMutationOptions;
    nativeOptions?: TNativeReactiveOptions;
  }) => {
    call: TParams extends object
      ? Omit<TParams, 'options' | 'nativeOptions'> extends
          | undefined
          | {
              options?: ReactiveMutationCallOptions;
              nativeOptions?: TNativeCallOptions;
            }
        ? (config?: {
            options?: ReactiveMutationCallOptions;
            nativeOptions?: TNativeCallOptions;
          }) => Promise<TResult>
        : (
            paramsAndConfig: TParams & {
              options?: ReactiveMutationCallOptions;
              nativeOptions?: TNativeCallOptions;
            },
          ) => Promise<TResult>
      : TParams extends void
      ? (config?: {
          options?: ReactiveMutationCallOptions;
          nativeOptions?: TNativeCallOptions;
        }) => Promise<TResult>
      : never;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: TError | null;
    data: TResult | undefined;
    reset: () => void;
    native: TNativeReturnType;
  };
};

export type ReactiveMutationOptions = {
  [key: string]: never;
  [key: symbol]: never;
  [key: number]: never;
};

export type ReactiveMutationCallOptions = {
  [key: string]: never;
  [key: symbol]: never;
  [key: number]: never;
};

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeCallOptions = unknown,
  TNativeReturnType = unknown,
> = ReactiveMutation<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TError,
  TNativeOptions,
  TNativeCallOptions,
  TNativeReturnType
>;
