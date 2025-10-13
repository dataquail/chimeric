export type ReactiveMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeReactiveOptions = unknown,
  TNativeInvokeOptions = unknown,
  TNativeReturnType = unknown,
> = {
  use: (allOptions?: {
    options?: ReactiveMutationOptions;
    nativeOptions?: TNativeReactiveOptions;
  }) => {
    invoke: [TParams] extends [void]
      ? (allInvokeOptions?: {
          options?: ReactiveMutationInvokeOptions;
          nativeOptions?: TNativeInvokeOptions;
        }) => Promise<TResult>
      : void extends TParams
      ? (allInvokeOptions?: {
          options?: ReactiveMutationInvokeOptions;
          nativeOptions?: TNativeInvokeOptions;
        }) => Promise<TResult>
      : undefined extends TParams
      ? (
          params?: TParams,
          allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: TNativeInvokeOptions;
          },
        ) => Promise<TResult>
      : (
          params: TParams,
          allInvokeOptions?: {
            options?: ReactiveMutationInvokeOptions;
            nativeOptions?: TNativeInvokeOptions;
          },
        ) => Promise<TResult>;
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
> = Parameters<T> extends []
  ? ReactiveMutation<
      void,
      Awaited<ReturnType<T>>,
      TError,
      TNativeOptions,
      TNativeInvokeOptions,
      TNativeReturnType
    >
  : ReactiveMutation<
      Parameters<T>[0],
      Awaited<ReturnType<T>>,
      TError,
      TNativeOptions,
      TNativeInvokeOptions,
      TNativeReturnType
    >;
