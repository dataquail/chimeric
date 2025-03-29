/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericAsyncRead } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from './chimericMethods.js';
import { WaitForReadOptions } from 'src/types/WaitForOptions.js';

export const ChimericAsyncReadTestHarness = <
  TParams,
  TResult,
  E extends Error,
>({
  chimericAsyncRead,
  chimericMethod,
  args,
  wrapper,
}: {
  chimericAsyncRead: ChimericAsyncRead<TParams, TResult, E>;
  chimericMethod: (typeof chimericMethods)[number];
  args?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: {
      data: TResult | undefined;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
    };
  };
} => {
  const result = {
    current: {
      data: undefined as TResult | undefined,
      isSuccess: false,
      isPending: true,
      isError: false,
      error: null as E | null,
    },
  };
  let promiseStatus = 'initial' as
    | 'initial'
    | 'pending'
    | 'resolved'
    | 'rejected';
  if (chimericMethod === 'idiomatic') {
    result.current.isPending = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let promise = chimericAsyncRead(args as any);
    promiseStatus = 'pending';
    promise
      .then((data) => {
        result.current.data = data;
        result.current.isPending = false;
        result.current.isSuccess = true;
        result.current.isError = false;
        result.current.error = null;
        promiseStatus = 'resolved';
      })
      .catch((error) => {
        result.current.isPending = false;
        result.current.isSuccess = false;
        result.current.isError = true;
        result.current.error = error as E;
        promiseStatus = 'rejected';
      });

    return {
      waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
        return new Promise<void>(async (resolve, reject) => {
          try {
            if (options?.reinvokeIdiomaticFn && promiseStatus === 'resolved') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              promise = chimericAsyncRead(args as any);
              promiseStatus = 'pending';
              promise
                .then((data) => {
                  result.current.data = data;
                  result.current.isPending = false;
                  result.current.isSuccess = true;
                  result.current.isError = false;
                  result.current.error = null;
                  promiseStatus = 'resolved';
                })
                .catch((error) => {
                  result.current.isPending = false;
                  result.current.isSuccess = false;
                  result.current.isError = true;
                  result.current.error = error as E;
                  promiseStatus = 'rejected';
                });
            }
            await promise;
            await checkOnInterval(
              cb,
              options?.interval ?? 1,
              options?.timeout ?? 3000,
              resolve,
              reject,
            );
          } catch (error) {
            if (error instanceof Error) {
              reject(error);
            } else {
              reject(new Error(String(error)));
            }
          }
        });
      },
      result,
    };
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hook = renderHook(() => chimericAsyncRead.useAsync(args as any), {
      wrapper,
    });
    return {
      waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
        await waitFor(cb, options);
      },
      result: hook.result,
    };
  }
};
