/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericPromise } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from './chimericMethods.js';

export const ChimericPromiseTestHarness = <TParams, TResult, E extends Error>({
  chimericPromise,
  chimericMethod,
  wrapper,
}: {
  chimericPromise: ChimericPromise<TParams, TResult, E>;
  chimericMethod: (typeof chimericMethods)[number];
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
}): {
  waitForSuccess: (cb: () => void) => Promise<void>;
  waitForError: (cb: () => void) => Promise<void>;
  waitForPending: (cb: () => void) => Promise<void>;
  result: {
    current: {
      call: (args: TParams) => Promise<TResult | void>;
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
      call: async (args: TParams) => {
        result.current.isPending = true;
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          chimericPromise(args as any)
            .then((data) => {
              result.current.data = data;
              result.current.isPending = false;
              result.current.isSuccess = true;
              result.current.isError = false;
              result.current.error = null;
              return data;
            })
            .catch((error) => {
              result.current.isPending = false;
              result.current.isSuccess = false;
              result.current.isError = true;
              result.current.error = error as E;
            })
        );
      },
      data: undefined as TResult | undefined,
      isSuccess: false,
      isPending: false,
      isError: false,
      error: null as E | null,
    },
  };
  if (chimericMethod === 'idiomatic') {
    return {
      waitForSuccess: async (cb: () => void) => {
        return new Promise<void>(async (resolve, reject) => {
          await checkOnInterval(cb, 1, 3000, resolve, reject);
        });
      },
      waitForError: async (cb: () => void) => {
        return new Promise<void>(async (resolve, reject) => {
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
    const hook = renderHook(() => chimericPromise.usePromise(), {
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
