/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericAsyncRead } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from './chimericMethods.js';

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
}) => {
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
      waitForSuccess: async (cb: () => void) => {
        return new Promise<void>(async (resolve, reject) => {
          if (promiseStatus === 'resolved') {
            // retry promise if it has already been resolved
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
          await checkOnInterval(cb, 1, 3000, resolve, reject);
        });
      },
      waitForError: async (cb: () => void) => {
        return new Promise<void>(async (resolve, reject) => {
          await promise;
          await checkOnInterval(cb, 1, 3000, resolve, reject);
        });
      },
      waitForPending: async (cb: () => void) => {
        return new Promise<void>(async (resolve, reject) => {
          await checkOnInterval(cb, 1, 3000, resolve, reject);
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
      waitForSuccess: async (cb: () => void) => {
        await waitFor(cb);
      },
      waitForError: async (cb: () => void) => {
        await waitFor(cb);
      },
      waitForPending: async (cb: () => void) => {
        await waitFor(cb);
      },
      result: hook.result,
    };
  }
};
