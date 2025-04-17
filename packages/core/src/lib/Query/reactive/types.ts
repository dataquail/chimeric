export type ReactiveQuery<
  TParams,
  TResult,
  E extends Error,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = TParams extends Record<'options', any>
  ? never
  : TParams extends void
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
> = ReactiveQuery<Parameters<T>[0], Awaited<ReturnType<T>>, E>;
