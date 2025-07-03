import {
  IdiomaticQueryTestHarnessReturnType as CoreIdiomaticQueryTestHarnessReturnType,
  ReactiveQueryTestHarnessReturnType as CoreReactiveQueryTestHarnessReturnType,
  ChimericQueryTestHarnessReturnType as CoreChimericQueryTestHarnessReturnType,
  chimericMethods,
} from '@chimeric/testing-core';
import { TanstackQueryReactiveReturnType } from '@chimeric/react-query';

export type IdiomaticQueryTestHarnessReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = CoreIdiomaticQueryTestHarnessReturnType<TResult, TError>;

export type ReactiveQueryTestHarnessReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = CoreReactiveQueryTestHarnessReturnType<
  TResult,
  TError,
  TanstackQueryReactiveReturnType<TResult, TError>
>;

export type ChimericQueryTestHarnessReturnType<
  TResult = unknown,
  TError extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
> = CoreChimericQueryTestHarnessReturnType<
  TResult,
  TError,
  TMethod,
  TanstackQueryReactiveReturnType<TResult, TError>
>;
