import { ChimericPromise } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { PromiseTestHarness } from './types.js';
import { IdiomaticPromiseTestHarness } from './IdiomaticPromiseTestHarness.js';
import { ReactivePromiseTestHarness } from './ReactivePromiseTestHarness.js';

export const ChimericPromiseTestHarness = <TParams, TResult, E extends Error>({
  chimericPromise,
  method,
  wrapper,
}: {
  chimericPromise: ChimericPromise<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
}): PromiseTestHarness<TParams, TResult, E> => {
  if (method === 'idiomatic') {
    return IdiomaticPromiseTestHarness({
      idiomaticPromise: chimericPromise,
    });
  } else {
    return ReactivePromiseTestHarness({
      reactivePromise: chimericPromise,
      wrapper,
    });
  }
};
