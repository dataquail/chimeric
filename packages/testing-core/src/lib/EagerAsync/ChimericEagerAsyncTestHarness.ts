import {
  ChimericEagerAsync,
  IdiomaticEagerAsync,
  ReactiveEagerAsync,
} from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from '../methods.js';
import { IdiomaticEagerAsyncTestHarness } from './IdiomaticEagerAsyncTestHarness.js';
import { ReactiveEagerAsyncTestHarness } from './ReactiveEagerAsyncTestHarness.js';
import { EagerAsyncTestHarnessReturnType } from './types.js';

export function ChimericEagerAsyncTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  args: TParams extends void
    ? {
        chimericEagerAsync: ChimericEagerAsync<TParams, TResult, TError>;
        method: (typeof chimericMethods)[number];
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        chimericEagerAsync: ChimericEagerAsync<TParams, TResult, TError>;
        method: (typeof chimericMethods)[number];
        params: TParams;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): EagerAsyncTestHarnessReturnType<TResult, TError> {
  const { chimericEagerAsync, method, wrapper } = args;
  if (method === 'idiomatic') {
    return IdiomaticEagerAsyncTestHarness({
      idiomaticEagerAsync: chimericEagerAsync,
      params: (args as { params: object }).params,
    } as unknown as TParams extends void ? { idiomaticEagerAsync: IdiomaticEagerAsync<TParams, TResult> } : { idiomaticEagerAsync: IdiomaticEagerAsync<TParams, TResult>; params: TParams });
  } else {
    return ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: chimericEagerAsync,
      params: (args as { params: object }).params,
      wrapper,
    } as unknown as TParams extends void ? { reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, TError> } : { reactiveEagerAsync: ReactiveEagerAsync<TParams, TResult, TError>; params: TParams });
  }
}
