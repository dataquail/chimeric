import {
  IdiomaticMutationTestHarnessReturnType as CoreIdiomaticMutationTestHarnessReturnType,
  ReactiveMutationTestHarnessReturnType as CoreReactiveMutationTestHarnessReturnType,
  ChimericMutationTestHarnessReturnType as CoreChimericMutationTestHarnessReturnType,
  chimericMethods,
} from '@chimeric/testing-core';
import {
  TanstackMutationReactiveCallOptions,
  TanstackMutationReactiveReturnType,
  TanstackIdiomaticNativeOptions,
} from '@chimeric/react-query';

export type IdiomaticMutationTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
> = CoreIdiomaticMutationTestHarnessReturnType<
  TParams,
  TResult,
  E,
  TanstackIdiomaticNativeOptions<TParams, TResult, E>
>;

export type ReactiveMutationTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
> = CoreReactiveMutationTestHarnessReturnType<
  TParams,
  TResult,
  E,
  TanstackMutationReactiveCallOptions<TParams, TResult, E>,
  TanstackMutationReactiveReturnType<TParams, TResult, E>
>;

export type ChimericMutationTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
> = CoreChimericMutationTestHarnessReturnType<
  TParams,
  TResult,
  E,
  TMethod,
  TanstackIdiomaticNativeOptions<TParams, TResult, E>,
  TanstackMutationReactiveCallOptions<TParams, TResult, E>,
  TanstackMutationReactiveReturnType<TParams, TResult, E>
>;
