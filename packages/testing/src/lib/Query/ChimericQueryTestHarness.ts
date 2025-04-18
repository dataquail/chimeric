import {
  ChimericQuery,
  IdiomaticQuery,
  IdiomaticQueryOptions,
  ReactiveQuery,
  ReactiveQueryOptions,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { QueryTestHarness } from './types.js';
import { IdiomaticQueryTestHarness } from './IdiomaticQueryTestHarness.js';
import { ReactiveQueryTestHarness } from './ReactiveQueryTestHarness.js';

// Overloads
export function ChimericQueryTestHarness<
  TParams extends void,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericQuery: ChimericQuery<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E>;
export function ChimericQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  chimericQuery: ChimericQuery<TParams, TResult, E>;
  method: (typeof chimericMethods)[number];
  params?: TParams;
  reactiveOptions?: ReactiveQueryOptions;
  idiomaticOptions?: IdiomaticQueryOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E>;

// Implementation
export function ChimericQueryTestHarness<
  TParams extends void | object,
  TResult = unknown,
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
}): QueryTestHarness<TResult, E> {
  if (method === 'idiomatic') {
    return IdiomaticQueryTestHarness({
      idiomaticQuery: chimericQuery as IdiomaticQuery<object, TResult>,
      params: params as object,
      options: idiomaticOptions,
    });
  } else {
    return ReactiveQueryTestHarness({
      reactiveQuery: chimericQuery as ReactiveQuery<object, TResult, E>,
      params: params as object,
      options: reactiveOptions,
      wrapper,
    });
  }
}
