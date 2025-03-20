import {
  UseMutationOptions as RQUseMutationOptions,
  MutateOptions as RQMutateOptions,
} from '@tanstack/react-query';
import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './utils';

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
    options: UseMutationOptions<TResult, E, TParams>;
  }) => {
    call: (
      args: TParams,
      options?: MutateOptions<TResult, E, TParams>,
    ) => Promise<TResult>;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
  errorHelpers: ErrorHelpers;
};

type UseMutationOptions<TResult, E extends Error, TParams> = Omit<
  RQUseMutationOptions<TResult, E, TParams, unknown>,
  'mutationKey'
>;

type MutateOptions<TResult, E extends Error, TParams> = RQMutateOptions<
  TResult,
  E,
  TParams,
  unknown
>;

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
