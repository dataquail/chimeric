import { IdiomaticAsyncFunction } from './IdiomaticAsyncFunction.js';
import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';

export type ChimericMutation<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticAsyncFunction<TParams, TResult> & {
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
