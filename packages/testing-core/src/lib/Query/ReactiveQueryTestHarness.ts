import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { QueryTestHarness } from './types.js';

// Overloads
export function ReactiveQueryTestHarness<
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveQuery: ReactiveQuery<undefined, TResult, E>;
  params?: undefined;
  options?: ReactiveQueryOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E>;
export function ReactiveQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(args: {
  reactiveQuery: ReactiveQuery<TParams, TResult, E>;
  params: TParams;
  options?: ReactiveQueryOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E>;

// Implementation
export function ReactiveQueryTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
>({
  reactiveQuery,
  params,
  options,
  wrapper,
}: {
  reactiveQuery: ReactiveQuery<TParams, TResult, E>;
  params?: TParams;
  options?: ReactiveQueryOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): QueryTestHarness<TResult, E> {
  const hook = renderHook(
    () =>
      reactiveQuery.useQuery({
        ...params,
        options: {
          ...options,
        },
      } as {
        options: ReactiveQueryOptions;
      } & TParams & {
          options?: ReactiveQueryOptions;
        }),
    {
      wrapper,
    },
  );
  return {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      await waitForReactTestingLibrary(cb, {
        timeout: options?.timeout,
        interval: options?.interval,
      });
    },
    result: hook.result,
  };
}
