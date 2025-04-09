import { IdiomaticAsync } from './Async';

export type ReactiveEagerAsync<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
> = TParams extends void
  ? {
      useEagerAsync: () => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : TParams extends object
  ? {
      useEagerAsync: (params: TParams) => {
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      };
    }
  : never;

export type ChimericEagerAsync<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticAsync<TParams, TResult> & ReactiveEagerAsync<TParams, TResult, E>;

export type DefineChimericEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericEagerAsync<Parameters<T>[0], Awaited<ReturnType<T>>, E>;

export type DefineReactiveEagerAsync<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveEagerAsync<Parameters<T>[0], Awaited<ReturnType<T>>, E>;
