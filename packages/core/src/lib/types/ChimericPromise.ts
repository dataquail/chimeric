import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './utils.js';

export type ChimericPromise<
  TParams,
  TResult,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = {
  call: (args: TParams) => Promise<TResult>;
  usePromise: () => {
    call: (args: TParams) => Promise<TResult>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
  errorHelpers: ErrorHelpers;
};

export type ChimericPromiseFactory<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = ChimericPromise<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E,
  ErrorHelpers
>;
