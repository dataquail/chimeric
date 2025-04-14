import {
  ChimericQuery,
  IdiomaticQueryOptions,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { QueryTestHarness } from './types.js';
import { IdiomaticQueryTestHarness } from './IdiomaticQueryTestHarness.js';
import { ReactiveQueryTestHarness } from './ReactiveQueryTestHarness.js';

export const ChimericQueryTestHarness = <
  TParams = void,
  TResult = void,
  E extends Error = Error,
>({
  chimericQuery,
  method,
  params,
  reactiveOptions,
  idiomaticOptions,
  wrapper,
}: {
  chimericQuery: ChimericQuery<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E> => {
  if (method === 'idiomatic') {
    return IdiomaticQueryTestHarness({
      idiomaticQuery: chimericQuery,
      params,
      options: idiomaticOptions,
    });
  } else {
    return ReactiveQueryTestHarness({
      reactiveQuery: chimericQuery,
      params,
      options: reactiveOptions,
      wrapper,
    });
  }
};
