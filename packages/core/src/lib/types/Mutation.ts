import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';

export type IdiomaticMutation<TParams, TResult> = (
  params: TParams,
) => Promise<TResult>;

export type ReactiveMutation<TParams, TResult, E extends Error> = {
  useMutation: (config?: { options: UseMutationOptions }) => {
    call: (args: TParams, options?: MutateOptions) => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    reset: () => void;
  };
};

export type ChimericMutation<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticMutation<TParams, TResult> & ReactiveMutation<TParams, TResult, E>;

type UseMutationOptions = object;

type MutateOptions = object;

export type DefineChimericMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
> = ChimericMutation<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = IdiomaticMutation<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>
>;

export type DefineReactiveMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
> = ReactiveMutation<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;
