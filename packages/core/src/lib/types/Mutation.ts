export type IdiomaticMutation<TParams, TResult> = TParams extends void
  ? () => Promise<TResult>
  : TParams extends object
  ? (params: TParams) => Promise<TResult>
  : never;

export type ReactiveMutation<
  TParams,
  TResult,
  E extends Error,
> = TParams extends void
  ? {
      useMutation: () => {
        call: () => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
        reset: () => void;
      };
    }
  : TParams extends object
  ? {
      useMutation: () => {
        call: (params: TParams) => Promise<TResult>;
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
        reset: () => void;
      };
    }
  : never;

export type ChimericMutation<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticMutation<TParams, TResult> & ReactiveMutation<TParams, TResult, E>;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericMutation<Parameters<T>[0], Awaited<ReturnType<T>>, E>;

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticMutation<Parameters<T>[0], Awaited<ReturnType<T>>>;

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveMutation<Parameters<T>[0], Awaited<ReturnType<T>>, E>;
