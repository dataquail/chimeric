export type ReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = {
  useMutation: (config?: {
    options?: ReactiveMutationOptions;
    nativeOptions?: TNativeReactiveOptions;
  }) => {
    invoke: TParams extends object
      ? Omit<TParams, 'options' | 'nativeOptions'> extends
          | undefined
          | {
              options?: ReactiveMutationInvokeOptions;
              nativeOptions?: TNativeInvokeOptions;
            }
        ? (config?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: TNativeInvokeOptions;
          }) => Promise<TResult>
        : (
            paramsAndConfig: TParams & {
              options?: ReactiveMutationInvokeOptions;
              nativeOptions?: TNativeInvokeOptions;
            },
          ) => Promise<TResult>
      : TParams extends void
      ? (config?: {
          options?: ReactiveMutationInvokeOptions;
          nativeOptions?: TNativeInvokeOptions;
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

export type ReactiveMutationInvokeOptions = {
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
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = ReactiveMutation<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TError,
  TNativeOptions,
  TNativeInvokeOptions,
  TNativeReturnType
>;
