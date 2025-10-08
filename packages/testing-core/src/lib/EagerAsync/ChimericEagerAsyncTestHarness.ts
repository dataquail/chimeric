import { ChimericEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { IdiomaticEagerAsyncTestHarness } from './IdiomaticEagerAsyncTestHarness.js';
import { ReactiveEagerAsyncTestHarness } from './ReactiveEagerAsyncTestHarness.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// Required params (must come first - most specific)
export function ChimericEagerAsyncTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
>(args: {
  chimericEagerAsync: ChimericEagerAsync<TParams, TResult, TError>;
  method: (typeof chimericMethods)[number];
  params: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// No params (must come before optional params)
export function ChimericEagerAsyncTestHarness<
  TResult,
  TError extends Error = Error,
>(args: {
  chimericEagerAsync: ChimericEagerAsync<void, TResult, TError>;
  method: (typeof chimericMethods)[number];
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Optional params (must come last)
export function ChimericEagerAsyncTestHarness<
  TParams,
  TResult,
  TError extends Error = Error,
>(args: {
  chimericEagerAsync: ChimericEagerAsync<TParams | undefined, TResult, TError>;
  method: (typeof chimericMethods)[number];
  params?: TParams | undefined;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Implementation
export function ChimericEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  chimericEagerAsync,
  method,
  params,
  wrapper,
}: {
  chimericEagerAsync: ChimericEagerAsync<TParams | undefined, TResult, TError>;
  method: (typeof chimericMethods)[number];
  params?: TParams | undefined;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError> {
  if (method === 'idiomatic') {
    return IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: chimericEagerAsync,
      params,
    });
  } else {
    return ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: chimericEagerAsync,
      params,
      wrapper,
    });
  }
}
