export type ReactiveQuery<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
> = TParams extends Record<'options', unknown>
  ? never
  : TParams extends undefined
  ? {
      useQuery: (params?: { options: ReactiveQueryOptions }) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
        refetch: () => Promise<TResult>;
      };
    }
  : TParams extends object
  ? {
      useQuery: (params: TParams & { options?: ReactiveQueryOptions }) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
        refetch: () => Promise<TResult>;
      };
    }
  : never;

export type ReactiveQueryOptions = { enabled?: boolean };

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveQuery<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;
