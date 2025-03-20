import {
  FetchQueryOptions,
  UseQueryOptions as RQUseQueryOptions,
} from '@tanstack/react-query';
import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './utils';

export type ChimericQuery<
  TParams,
  TResult,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = {
  call: (
    args: TParams extends void
      ? {
          options?: CallQueryOptions<TResult, E> & { forceRefetch?: boolean };
        } | void
      : {
          options?: CallQueryOptions<TResult, E> & { forceRefetch?: boolean };
        } & TParams,
  ) => Promise<TResult>;
  useQuery: (
    args: TParams extends void
      ? { options?: UseQueryOptions<TResult, E> } | void
      : { options?: UseQueryOptions<TResult, E> } & TParams,
  ) => {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
  errorHelpers: ErrorHelpers;
};

type CallQueryOptions<TResult, E extends Error> = Omit<
  FetchQueryOptions<TResult, E, TResult, string[]>,
  'queryKey'
>;

type UseQueryOptions<TResult, E extends Error> = Omit<
  RQUseQueryOptions<TResult, E, TResult, string[]>,
  'queryKey'
>;

export type ChimericQueryFactory<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = ChimericQuery<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E,
  ErrorHelpers
>;
