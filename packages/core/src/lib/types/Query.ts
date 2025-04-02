import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';

export type IdiomaticQuery<TParams, TResult> = (
  paramsOrOptions?: IdiomaticQueryParams<TParams>,
  optionsOrNever?: IdiomaticQueryOptionsOrNever<TParams>,
) => Promise<TResult>;

export type ReactiveQuery<TParams, TResult, E extends Error> = {
  useQuery: (
    paramsOrOptions?: ReactiveQueryParamsOrOptions<TParams>,
    optionsOrNever?: ReactiveQueryOptionsOrNever<TParams>,
  ) => {
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
  ? IdiomaticQueryOptions | void
  : TParams extends IdiomaticQueryOptions
  ? never
  : TParams;

export type IdiomaticQueryOptionsOrNever<TParams> = TParams extends void
  ? never
  : IdiomaticQueryOptions | void;

export type IdiomaticQueryOptions = { forceRefetch?: boolean };

export type ReactiveQueryParamsOrOptions<TParams> = TParams extends void
  ? ReactiveQueryOptions | void
  : TParams extends ReactiveQueryOptions
  ? never
  : TParams;

export type ReactiveQueryOptionsOrNever<TParams> = TParams extends void
  ? never
  : ReactiveQueryOptions | void;

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
