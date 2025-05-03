import { ChimericEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { IdiomaticEagerAsyncTestHarness } from './IdiomaticEagerAsyncTestHarness.js';
import { ReactiveEagerAsyncTestHarness } from './ReactiveEagerAsyncTestHarness.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// Overloads
export function ChimericEagerAsyncTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericEagerAsync: ChimericEagerAsync<undefined, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: undefined;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, E>;
export function ChimericEagerAsyncTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericEagerAsync: ChimericEagerAsync<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, E>;

// Implementation
export function ChimericEagerAsyncTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>({
  chimericEagerAsync,
  method,
  params,
  wrapper,
}: {
  chimericEagerAsync: ChimericEagerAsync<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, E> {
  if (method === 'idiomatic') {
    return IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: chimericEagerAsync,
      params: params as object,
    });
  } else {
    return ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: chimericEagerAsync,
      params: params as object,
      wrapper,
    });
  }
}
