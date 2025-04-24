export type ReactiveQuery<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = TParams extends Record<'options' | 'nativeOptions', unknown>
  ? never
  : TParams extends undefined
  ? {
      useQuery: (params?: {
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
      }) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
        refetch: () => Promise<TResult>;
        native: TNativeReturnType;
      };
    }
  : TParams extends object
  ? {
      useQuery: (
        params: TParams & {
          options?: ReactiveQueryOptions;
          nativeOptions?: TNativeOptions;
        },
      ) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
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
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
> = ReactiveQuery<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E,
  TNativeOptions,
  TNativeReturnType
>;
