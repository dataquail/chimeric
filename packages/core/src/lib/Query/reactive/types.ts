export type ReactiveQuery<
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args: Parameters<T>[0] extends Record<'options', any>
      ? never
      : Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveQuery<
  Parameters<T>[0] extends void
    ? void
    : Parameters<T>[0] extends object
    ? Parameters<T>[0]
    : never,
  Awaited<ReturnType<T>>,
  E
>;
