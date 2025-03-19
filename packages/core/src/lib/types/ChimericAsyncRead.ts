import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './utils.js';

export type ChimericAsyncRead<
  TParams,
  TResult,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = {
  call: (args: TParams) => Promise<TResult>;
  useAsync: (args: TParams) => {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
  errorHelpers: ErrorHelpers;
};

export type ChimericAsyncReadFactory<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = ChimericAsyncRead<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E,
  ErrorHelpers
>;
