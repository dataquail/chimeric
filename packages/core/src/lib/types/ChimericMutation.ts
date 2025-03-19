import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './utils.js';

export type ChimericMutation<
  TParams,
  TResult,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = {
  call: (args: TParams) => Promise<TResult>;
  useMutation: (config?: {
    options: UseMutationOptions;
  }) => {
    call: (
      args: TParams,
      options?: MutateOptions,
    ) => Promise<TResult>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
  errorHelpers: ErrorHelpers;
};

type UseMutationOptions = object;

type MutateOptions = object;

export type ChimericMutationFactory<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
> = ChimericMutation<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E,
  ErrorHelpers
>;
