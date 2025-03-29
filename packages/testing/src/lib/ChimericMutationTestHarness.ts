/* eslint-disable no-async-promise-executor */
import { JSX, ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ChimericMutation } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { chimericMethods } from './chimericMethods.js';

export const ChimericMutationTestHarness = <TParams, TResult, E extends Error>({
  chimericMutation,
  chimericMethod,
  wrapper,
}: {
  chimericMutation: ChimericMutation<TParams, TResult, E>;
  chimericMethod: (typeof chimericMethods)[number];
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
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
  if (chimericMethod === 'idiomatic') {
    return {
      call: (args: TParams) => {
        result.current.isPending = true;
        result.current.isSuccess = false;
        result.current.isError = false;
        result.current.error = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise = chimericMutation(args as any);
        promise
          .then((data) => {
            result.current.data = data;
            result.current.isPending = false;
            result.current.isSuccess = true;
            result.current.isError = false;
            result.current.error = null;
          })
          .catch((error) => {
            result.current.isPending = false;
            result.current.isSuccess = false;
            result.current.isError = true;
            result.current.error = error as E;
          });

        return promise;
      },
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
    const hook = renderHook(() => chimericMutation.useMutation(), {
      wrapper,
    });
    return {
      call: hook.result.current.call,
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
