import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';

export type IdiomaticQuery<TParams, TResult> = (
  params: IdiomaticQueryParams<TParams>,
) => Promise<TResult>;

export type ReactiveQuery<TParams, TResult, E extends Error> = {
  useQuery: (args: ReactiveQueryParams<TParams>) => {
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    refetch: () => Promise<TResult>;
  };
};

export type ChimericQuery<TParams, TResult, E extends Error> = IdiomaticQuery<
  TParams,
  TResult
> &
  ReactiveQuery<TParams, TResult, E>;

export type IdiomaticQueryParams<TParams> = TParams extends void
  ? {
      options?: IdiomaticQueryOptions;
    } | void
  : {
      options?: IdiomaticQueryOptions;
    } & TParams;

export type IdiomaticQueryOptions = { forceRefetch?: boolean };

export type ReactiveQueryParams<TParams> = TParams extends void
  ? { options?: ReactiveQueryOptions } | void
  : { options?: ReactiveQueryOptions } & TParams;

export type ReactiveQueryOptions = { enabled?: boolean };

export type DefineChimericQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ChimericQuery<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;

export type DefineIdiomaticQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticQuery<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>
>;

export type DefineReactiveQuery<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error = Error,
> = ReactiveQuery<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;
