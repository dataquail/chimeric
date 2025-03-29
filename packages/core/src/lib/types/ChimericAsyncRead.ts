import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';
import { IdiomaticAsyncFunction } from './IdiomaticAsyncFunction.js';

export type ChimericAsyncRead<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticAsyncFunction<TParams, TResult> & {
  useAsync: (args: TParams) => {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
};

export type DefineChimericAsyncRead<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
> = ChimericAsyncRead<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;
