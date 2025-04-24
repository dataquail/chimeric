export type ReactiveMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = TParams extends Record<'options' | 'nativeOptions', unknown>
  ? never
  : {
      useMutation: (config?: {
        options?: ReactiveMutationOptions;
        nativeOptions?: TNativeOptions;
      }) => {
        call: TParams extends undefined
          ? () => Promise<TResult>
          : (params: TParams) => Promise<TResult>;
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

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = ReactiveMutation<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E,
  TNativeOptions,
  TNativeReturnType
>;
