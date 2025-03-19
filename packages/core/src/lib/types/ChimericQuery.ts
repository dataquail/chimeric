import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './utils.js';

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
          options?: CallQueryOptions;
        } | void
      : {
          options?: CallQueryOptions;
        } & TParams,
  ) => Promise<TResult>;
  useQuery: (
    args: TParams extends void
      ? { options?: UseQueryOptions } | void
      : { options?: UseQueryOptions } & TParams,
  ) => {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
  errorHelpers: ErrorHelpers;
};

type CallQueryOptions = { forceRefetch?: boolean }

type UseQueryOptions = { enabled?: boolean }

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
