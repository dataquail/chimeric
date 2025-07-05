export type ReactiveQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = TParams extends object
  ? Omit<TParams, 'options' | 'nativeOptions'> extends
      | undefined
      | {
          options?: ReactiveQueryOptions;
          nativeOptions?: TNativeOptions;
        }
    ? {
        use: (params?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: TNativeOptions;
        }) => {
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: TError | null;
          data: TResult | undefined;
          refetch: () => Promise<TResult>;
          native: TNativeReturnType;
        };
      }
    : {
        use: (
          paramsAndConfig: TParams & {
            options?: ReactiveQueryOptions;
            nativeOptions?: TNativeOptions;
          },
        ) => {
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: TError | null;
          data: TResult | undefined;
          refetch: () => Promise<TResult>;
          native: TNativeReturnType;
        };
      }
  : TParams extends void
  ? {
      use: (params?: {
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: TError | null;
        data: TResult | undefined;
        refetch: () => Promise<TResult>;
        native: TNativeReturnType;
      };
    }
  : never;

export type ReactiveQueryOptions = { enabled?: boolean };

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = ReactiveQuery<
  Parameters<T>[0] extends void | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  TError,
  TNativeOptions,
  TNativeReturnType
>;
