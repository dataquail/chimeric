import {
  IdiomaticQueryTestHarnessReturnType as CoreIdiomaticQueryTestHarnessReturnType,
  ReactiveQueryTestHarnessReturnType as CoreReactiveQueryTestHarnessReturnType,
  ChimericQueryTestHarnessReturnType as CoreChimericQueryTestHarnessReturnType,
  chimericMethods,
} from '@chimeric/testing-core';
import { TanstackQueryReactiveReturnType } from '@chimeric/react-query';

export type IdiomaticQueryTestHarnessReturnType<
  TResult = unknown,
  E extends Error = Error,
> = CoreIdiomaticQueryTestHarnessReturnType<TResult, E>;

export type ReactiveQueryTestHarnessReturnType<
  TResult = unknown,
  E extends Error = Error,
> = CoreReactiveQueryTestHarnessReturnType<
  TResult,
  E,
  TanstackQueryReactiveReturnType<TResult, E>
>;

export type ChimericQueryTestHarnessReturnType<
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
> = CoreChimericQueryTestHarnessReturnType<
  TResult,
  E,
  TMethod,
  TanstackQueryReactiveReturnType<TResult, E>
>;
