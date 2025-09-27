import {
  IdiomaticInfiniteQueryTestHarnessReturnType as CoreIdiomaticInfiniteQueryTestHarnessReturnType,
  ReactiveInfiniteQueryTestHarnessReturnType as CoreReactiveInfiniteQueryTestHarnessReturnType,
  ChimericInfiniteQueryTestHarnessReturnType as CoreChimericInfiniteQueryTestHarnessReturnType,
} from '@chimeric/testing-core';

export type IdiomaticInfiniteQueryTestHarnessReturnType<
  TPageData = unknown,
  TPageParam = unknown,
  E extends Error = Error,
> = CoreIdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, E>;

export type ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData = unknown,
  TPageParam = unknown,
  E extends Error = Error,
  TReactiveNativeReturnType = unknown,
> = CoreReactiveInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  E,
  TReactiveNativeReturnType
>;

export type ChimericInfiniteQueryTestHarnessReturnType<
  TPageData = unknown,
  TPageParam = unknown,
  E extends Error = Error,
  TMethod = unknown,
  TReactiveNativeReturnType = unknown,
> = CoreChimericInfiniteQueryTestHarnessReturnType<
  TPageData,
  TPageParam,
  E,
  TMethod,
  TReactiveNativeReturnType
>;