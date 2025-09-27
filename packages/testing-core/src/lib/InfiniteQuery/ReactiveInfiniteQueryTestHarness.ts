import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ReactiveInfiniteQuery, ReactiveInfiniteQueryOptions } from '@chimeric/core';
import { JSX, ReactNode } from 'react';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';
import { ReactiveInfiniteQueryTestHarnessReturnType } from './types.js';

export function ReactiveInfiniteQueryTestHarness<
  TParams = void,
  TPageData = unknown,
  TPageParam = unknown,
  TError extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  args: TParams extends void
    ? {
        reactiveInfiniteQuery: ReactiveInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TError,
          TNativeOptions,
          TNativeReturnType
        >;
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TNativeOptions;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      }
    : {
        reactiveInfiniteQuery: ReactiveInfiniteQuery<
          TParams,
          TPageData,
          TPageParam,
          TError,
          TNativeOptions,
          TNativeReturnType
        >;
        params: TParams;
        options?: ReactiveInfiniteQueryOptions;
        nativeOptions?: TNativeOptions;
        wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
      },
): ReactiveInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, TError, TNativeReturnType> {
  const { reactiveInfiniteQuery, options, nativeOptions, wrapper } = args;
  const hook = renderHook(
    () =>
      reactiveInfiniteQuery.use({
        ...(args as { params: TParams }).params,
        options,
        nativeOptions,
      } as {
        options: ReactiveInfiniteQueryOptions;
        nativeOptions: TNativeOptions;
      } & TParams & {
          options?: ReactiveInfiniteQueryOptions;
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