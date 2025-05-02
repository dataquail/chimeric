import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReactiveQueryTestHarnessReturnType } from './types.js';

// Overloads
export function ReactiveQueryTestHarness<
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveQuery: ReactiveQuery<
    undefined,
    TResult,
    E,
    TNativeOptions,
    TNativeReturnType
  >;
  params?: undefined;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, E>;
export function ReactiveQueryTestHarness<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(args: {
  reactiveQuery: ReactiveQuery<
    TParams,
    TResult,
    E,
    TNativeOptions,
    TNativeReturnType
  >;
  params: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, E>;

// Implementation
export function ReactiveQueryTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>({
  reactiveQuery,
  params,
  options,
  nativeOptions,
  wrapper,
}: {
  reactiveQuery: ReactiveQuery<
    TParams,
    TResult,
    E,
    TNativeOptions,
    TNativeReturnType
  >;
  params?: TParams;
  options?: ReactiveQueryOptions;
  nativeOptions?: TNativeOptions;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): ReactiveQueryTestHarnessReturnType<TResult, E> {
  const hook = renderHook(
    () =>
      reactiveQuery.useQuery({
        ...params,
        options,
        nativeOptions,
      } as {
        options: ReactiveQueryOptions;
        nativeOptions: TNativeOptions;
      } & TParams & {
          options?: ReactiveQueryOptions;
          nativeOptions?: TNativeOptions;
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
