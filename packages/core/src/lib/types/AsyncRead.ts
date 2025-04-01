import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';

export type IdiomaticAsyncRead<TParams, TResult> = (
  params: TParams,
) => Promise<TResult>;

export type ReactiveAsyncRead<TParams, TResult, E extends Error> = {
  useAsync: (params: TParams) => {
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
};

export type ChimericAsyncRead<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticAsyncRead<TParams, TResult> &
  ReactiveAsyncRead<TParams, TResult, E>;

export type DefineChimericAsyncRead<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
> = ChimericAsyncRead<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;

export type DefineIdiomaticAsyncRead<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticAsyncRead<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>
>;

export type DefineReactiveAsyncRead<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
> = ReactiveAsyncRead<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;
