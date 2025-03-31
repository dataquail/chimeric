import { IdiomaticAsyncFunction } from './IdiomaticAsyncFunction.js';
import {
  ExtractChimericParameter,
  ExtractChimericPromiseReturnType,
} from './UtilityTypes.js';

export type ChimericPromise<
  TParams,
  TResult,
  E extends Error,
> = IdiomaticAsyncFunction<TParams, TResult> & {
  usePromise: () => {
    call: IdiomaticAsyncFunction<TParams, TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  };
};

export type DefineChimericPromise<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
  E extends Error,
> = ChimericPromise<
  ExtractChimericParameter<T>,
  ExtractChimericPromiseReturnType<T>,
  E
>;
