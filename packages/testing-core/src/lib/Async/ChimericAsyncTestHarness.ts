import {
  ChimericAsync,
  ReactiveAsyncOptions,
  IdiomaticAsyncOptions,
  IdiomaticAsync,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { AsyncTestHarnessReturnType } from './types';
import { IdiomaticAsyncTestHarness } from './IdiomaticAsyncTestHarness';
import { ReactiveAsyncTestHarness } from './ReactiveAsyncTestHarness';

// Optional params
export function ChimericAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  chimericAsync,
  method,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericAsync: ChimericAsync<TParams | undefined, TResult, E>;
  method: 'idiomatic' | 'reactive';
  reactiveOptions?: ReactiveAsyncOptions;
  idiomaticOptions?: IdiomaticAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<TParams | undefined, TResult, E>;

// No params
export function ChimericAsyncTestHarness<
  TResult = unknown,
  E extends Error = Error,
>({
  chimericAsync,
  method,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericAsync: ChimericAsync<void, TResult, E>;
  method: 'idiomatic' | 'reactive';
  reactiveOptions?: ReactiveAsyncOptions;
  idiomaticOptions?: IdiomaticAsyncOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarnessReturnType<void, TResult, E>;

// Required params
export function ChimericAsyncTestHarness<
  TParams,
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
}): AsyncTestHarnessReturnType<TParams, TResult, E>;

// Implementation
export function ChimericAsyncTestHarness<
  TParams = void,
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
      idiomaticAsync: chimericAsync as IdiomaticAsync<TParams, TResult>,
      idiomaticOptions,
    });
  }
  if (method === 'reactive') {
    return ReactiveAsyncTestHarness({
      reactiveAsync: chimericAsync,
      reactiveOptions,
      wrapper,
    });
  } else {
    throw new Error('Invalid method');
  }
}
