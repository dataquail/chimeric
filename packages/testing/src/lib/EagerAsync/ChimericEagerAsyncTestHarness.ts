import { ChimericEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { IdiomaticEagerAsyncTestHarness } from './IdiomaticEagerAsyncTestHarness.js';
import { ReactiveEagerAsyncTestHarness } from './ReactiveEagerAsyncTestHarness.js';
import { EagerAsyncTestHarness } from './types.js';

// Overloads
export function ChimericEagerAsyncTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericEagerAsync: ChimericEagerAsync<void, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: void;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarness<TResult, E>;
export function ChimericEagerAsyncTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericEagerAsync: ChimericEagerAsync<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarness<TResult, E>;

// Implementation
export function ChimericEagerAsyncTestHarness<
  TParams extends void | object,
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
}): EagerAsyncTestHarness<TResult, E> {
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
