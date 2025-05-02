import {
  ChimericAsync,
  ReactiveAsyncOptions,
  IdiomaticAsyncOptions,
  ReactiveAsync,
  IdiomaticAsync,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { AsyncTestHarnessReturnType } from './types';
import { IdiomaticAsyncTestHarness } from './IdiomaticAsyncTestHarness';
import { ReactiveAsyncTestHarness } from './ReactiveAsyncTestHarness';

// Define separate implementations for void and object parameters
export function ChimericAsyncTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericAsync: ChimericAsync<undefined, TResult, E>;
  method: 'idiomatic' | 'reactive';
  reactiveOptions?: ReactiveAsyncOptions;
  idiomaticOptions?: IdiomaticAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<undefined, TResult, E>;
export function ChimericAsyncTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericAsync: ChimericAsync<TParams, TResult, E>;
  method: 'idiomatic' | 'reactive';
  reactiveOptions?: ReactiveAsyncOptions;
  idiomaticOptions?: IdiomaticAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<TParams, TResult, E>;

// Implementation
export function ChimericAsyncTestHarness<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>({
  chimericAsync,
  method,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericAsync: ChimericAsync<TParams, TResult, E>;
  method: 'idiomatic' | 'reactive';
  reactiveOptions?: ReactiveAsyncOptions;
  idiomaticOptions?: IdiomaticAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<TParams, TResult, E> {
  if (method === 'idiomatic') {
    return IdiomaticAsyncTestHarness({
      idiomaticAsync: chimericAsync as IdiomaticAsync<object, TResult>,
      idiomaticOptions,
    }) as AsyncTestHarnessReturnType<TParams, TResult, E>;
  }
  if (method === 'reactive') {
    return ReactiveAsyncTestHarness({
      reactiveAsync: chimericAsync as ReactiveAsync<object, TResult, E>,
      reactiveOptions,
      wrapper,
    }) as AsyncTestHarnessReturnType<TParams, TResult, E>;
  } else {
    throw new Error('Invalid method');
  }
}
