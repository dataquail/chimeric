import { ChimericAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { AsyncTestHarness } from './types.js';
import { IdiomaticAsyncTestHarness } from './IdiomaticAsyncTestHarness.js';
import { ReactiveAsyncTestHarness } from './ReactiveAsyncTestHarness.js';

export const ChimericAsyncTestHarness = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  chimericAsync,
  method,
  params,
  wrapper,
}: {
  chimericAsync: ChimericAsync<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncTestHarness<TParams, TResult, E> => {
  if (method === 'idiomatic') {
    return IdiomaticAsyncTestHarness<TParams, TResult, E>({
      idiomaticAsync: chimericAsync,
    });
  } else {
    return ReactiveAsyncTestHarness<TParams, TResult, E>({
      reactiveAsync: chimericAsync,
      params,
      wrapper,
    });
  }
};
