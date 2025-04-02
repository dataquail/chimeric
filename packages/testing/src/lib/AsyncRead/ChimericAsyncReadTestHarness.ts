import { ChimericAsyncRead } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { IdiomaticAsyncReadTestHarness } from './IdiomaticAsyncReadTestHarness.js';
import { ReactiveAsyncReadTestHarness } from './ReactiveAsyncReadTestHarness.js';
import { AsyncReadTestHarness } from './types.js';

export const ChimericAsyncReadTestHarness = <
  TParams,
  TResult,
  E extends Error,
>({
  chimericAsyncRead,
  method,
  params,
  wrapper,
}: {
  chimericAsyncRead: ChimericAsyncRead<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): AsyncReadTestHarness<TResult, E> => {
  if (method === 'idiomatic') {
    return IdiomaticAsyncReadTestHarness({
      idiomaticAsyncRead: chimericAsyncRead,
      params,
    });
  } else {
    return ReactiveAsyncReadTestHarness({
      reactiveAsyncRead: chimericAsyncRead,
      params,
      wrapper,
    });
  }
};
