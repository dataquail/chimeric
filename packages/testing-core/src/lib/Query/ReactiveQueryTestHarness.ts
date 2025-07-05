import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveQuery, ReactiveQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReactiveQueryTestHarnessReturnType } from './types.js';

export function ReactiveQueryTestHarness<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  args: TParams extends void
    ? {
        reactiveQuery: ReactiveQuery<
          TParams,
          TResult,
          TError,
          TNativeOptions,
          TNativeReturnType
        >;
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        reactiveQuery: ReactiveQuery<
          TParams,
          TResult,
          TError,
          TNativeOptions,
          TNativeReturnType
        >;
        params: TParams;
        options?: ReactiveQueryOptions;
        nativeOptions?: TNativeOptions;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): ReactiveQueryTestHarnessReturnType<TResult, TError> {
  const { reactiveQuery, options, nativeOptions, wrapper } = args;
  const hook = renderHook(
    () =>
      reactiveQuery.use({
        ...(args as { params: TParams }).params,
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
