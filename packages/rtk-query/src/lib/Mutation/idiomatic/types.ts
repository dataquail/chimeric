import {
  IdiomaticMutation as CoreIdiomaticMutation,
  DefineIdiomaticMutation as CoreDefineIdiomaticMutation,
} from '@chimeric/core';

export type RtkMutationIdiomaticNativeOptions = {
  track?: boolean;
  fixedCacheKey?: string;
};

export type IdiomaticMutation<
  TParams = void,
  TResult = unknown,
> = CoreIdiomaticMutation<
  TParams,
  TResult,
  RtkMutationIdiomaticNativeOptions
>;

export type DefineIdiomaticMutation<
  T extends (
    args: Parameters<T>[0],
  ) => ReturnType<T> extends Promise<infer R> ? Promise<R> : never,
> = CoreDefineIdiomaticMutation<T, RtkMutationIdiomaticNativeOptions>;
