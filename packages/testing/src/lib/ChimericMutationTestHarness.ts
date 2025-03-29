/* eslint-disable no-async-promise-executor */
import { JSX, ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ChimericMutation } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { chimericMethods } from './chimericMethods.js';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';

export const ChimericMutationTestHarness = <TParams, TResult, E extends Error>({
  chimericMutation,
  chimericMethod,
  wrapper,
}: {
  chimericMutation: ChimericMutation<TParams, TResult, E>;
  chimericMethod: (typeof chimericMethods)[number];
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
}): {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
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
      data: undefined as TResult | undefined,
      isSuccess: false,
      isPending: true,
      isError: false,
      error: null as E | null,
    },
  };
  if (chimericMethod === 'idiomatic') {
    return {
      waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
        return new Promise<void>(async (resolve, reject) => {
          await checkOnInterval(
            cb,
            options?.interval ?? 1,
            options?.timeout ?? 3000,
            resolve,
            reject,
          );
        });
      },
      result,
    };
  } else {
    const hook = renderHook(() => chimericMutation.useMutation(), {
      wrapper,
    });
    return {
      waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
        await waitFor(cb, options);
      },
      result: hook.result,
    };
  }
};
