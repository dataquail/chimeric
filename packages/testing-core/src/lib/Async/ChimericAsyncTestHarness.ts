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

export function ChimericAsyncTestHarness<
  TParams,
  TResult,
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
      reactiveAsync: chimericAsync as ReactiveAsync<TParams, TResult, E>,
      reactiveOptions,
      wrapper,
    });
  } else {
    throw new Error('Invalid method');
  }
}
