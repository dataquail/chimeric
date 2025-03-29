import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';
import { IdiomaticAsyncFunction } from './IdiomaticAsyncFunction.js';

export type ChimericQuery<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticAsyncFunction<IdiomaticQueryParams<TParams>, TResult> & {
  useQuery: (args: ReactiveQueryParams<TParams>) => {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
};

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
  E extends Error,
> = ChimericQuery<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;
