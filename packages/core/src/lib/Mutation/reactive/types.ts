export type ReactiveMutation<
  TParams extends undefined | object,
  TResult,
  E extends Error,
> = TParams extends Record<'options', unknown>
  ? never
  : {
      useMutation: () => {
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
      };
    };

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveMutation<
  Parameters<T>[0] extends undefined | object ? Parameters<T>[0] : never,
  Awaited<ReturnType<T>>,
  E
>;
