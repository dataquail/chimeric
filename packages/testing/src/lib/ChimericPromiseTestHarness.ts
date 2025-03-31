/* eslint-disable no-async-promise-executor */
import {
  waitFor as waitForReactTestingLibrary,
  renderHook,
} from '@testing-library/react';
import { ChimericPromise } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from './chimericMethods.js';
import { BaseWaitForOptions } from 'src/types/WaitForOptions.js';

export const ChimericPromiseTestHarness = <TParams, TResult, E extends Error>({
  chimericPromise,
  chimericMethod,
  wrapper,
}: {
  chimericPromise: ChimericPromise<TParams, TResult, E>;
  chimericMethod: (typeof chimericMethods)[number];
  wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
}): {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      call: (args: TParams) => Promise<TResult | void>;
      data: TResult | undefined;
      isIdle: boolean;
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
              result.current.isIdle = false;
              result.current.isPending = false;
              result.current.isSuccess = true;
              result.current.isError = false;
              result.current.error = null;
              return data;
            })
            .catch((error) => {
              result.current.isIdle = false;
              result.current.isPending = false;
              result.current.isSuccess = false;
              result.current.isError = true;
              result.current.error = error as E;
            })
        );
      },
      data: undefined as TResult | undefined,
      isIdle: true,
      isSuccess: false,
      isPending: false,
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
    const hook = renderHook(() => chimericPromise.usePromise(), {
      wrapper,
    });
    return {
      waitFor: async (cb: () => void, options?: BaseWaitForOptions) => {
        await waitForReactTestingLibrary(cb, {
          timeout: options?.timeout,
          interval: options?.interval,
        });
      },
      result: hook.result,
    };
  }
};
