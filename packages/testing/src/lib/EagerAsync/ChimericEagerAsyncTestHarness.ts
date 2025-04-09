import { ChimericEagerAsync } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { IdiomaticEagerAsyncTestHarness } from './IdiomaticEagerAsyncTestHarness.js';
import { ReactiveEagerAsyncTestHarness } from './ReactiveEagerAsyncTestHarness.js';
import { EagerAsyncTestHarness } from './types.js';

export const ChimericEagerAsyncTestHarness = <
  TParams = void,
  TResult = void,
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
}): EagerAsyncTestHarness<TResult, E> => {
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
};
