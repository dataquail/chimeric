import { ChimericEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { IdiomaticEagerAsyncTestHarness } from './IdiomaticEagerAsyncTestHarness.js';
import { ReactiveEagerAsyncTestHarness } from './ReactiveEagerAsyncTestHarness.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

export function ChimericEagerAsyncTestHarness<
  TParams,
  TResult,
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
      params: params as TParams,
    });
  } else {
    return ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: chimericEagerAsync,
      params: params as TParams,
      wrapper,
    });
  }
}
