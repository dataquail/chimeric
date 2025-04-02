import { ChimericQuery } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { QueryTestHarness } from './types.js';
import { IdiomaticQueryTestHarness } from './IdiomaticQueryTestHarness.js';
import { ReactiveQueryTestHarness } from './ReactiveQueryTestHarness.js';

export const ChimericQueryTestHarness = <TParams, TResult, E extends Error>({
  chimericQuery,
  method,
  params,
  wrapper,
}: {
  chimericQuery: ChimericQuery<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E> => {
  if (method === 'idiomatic') {
    return IdiomaticQueryTestHarness({
      idiomaticQuery: chimericQuery,
      params,
    });
  } else {
    return ReactiveQueryTestHarness({
      reactiveQuery: chimericQuery,
      params,
      wrapper,
    });
  }
};
