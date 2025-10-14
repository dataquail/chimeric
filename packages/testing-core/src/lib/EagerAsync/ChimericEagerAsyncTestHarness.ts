import {
  ChimericEagerAsync,
  IdiomaticEagerAsync,
  ReactiveEagerAsync,
  IdiomaticEagerAsyncOptions,
  ReactiveEagerAsyncOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { IdiomaticEagerAsyncTestHarness } from './IdiomaticEagerAsyncTestHarness.js';
import { ReactiveEagerAsyncTestHarness } from './ReactiveEagerAsyncTestHarness.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

// No params
export function ChimericEagerAsyncTestHarness<
  TResult = unknown,
  TError extends Error = Error,
>({
  chimericEagerAsync,
  method,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericEagerAsync: ChimericEagerAsync<void, TResult, TError>;
  method: 'idiomatic' | 'reactive';
  reactiveOptions?: ReactiveEagerAsyncOptions;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Optional params
export function ChimericEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  chimericEagerAsync,
  method,
  params,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericEagerAsync: ChimericEagerAsync<TParams | undefined, TResult, TError>;
  method: 'idiomatic' | 'reactive';
  params?: TParams;
  reactiveOptions?: ReactiveEagerAsyncOptions;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError>;

// Required params
export function ChimericEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  chimericEagerAsync,
  method,
  params,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericEagerAsync: ChimericEagerAsync<TParams, TResult, TError>;
  method: 'idiomatic' | 'reactive';
  params: TParams;
  reactiveOptions?: ReactiveEagerAsyncOptions;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
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
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericEagerAsync: ChimericEagerAsync<TParams, TResult, TError>;
  method: 'idiomatic' | 'reactive';
  params?: TParams;
  reactiveOptions?: ReactiveEagerAsyncOptions;
  idiomaticOptions?: IdiomaticEagerAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): EagerAsyncTestHarnessReturnType<TResult, TError> {
  if (method === 'idiomatic') {
    return IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: chimericEagerAsync as IdiomaticEagerAsync<
        TParams,
        TResult
      >,
      params,
      idiomaticOptions,
    } as Parameters<typeof IdiomaticEagerAsyncTestHarness<TParams, TResult, TError>>[0]);
  }
  if (method === 'reactive') {
    return ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: chimericEagerAsync as ReactiveEagerAsync<
        TParams,
        TResult,
        TError
      >,
      params,
      reactiveOptions,
      wrapper,
    } as Parameters<typeof ReactiveEagerAsyncTestHarness<TParams, TResult, TError>>[0]);
  } else {
    throw new Error('Invalid method');
  }
}
