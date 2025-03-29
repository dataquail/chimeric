/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericRead } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from './chimericMethods.js';
import { WaitForReadOptions } from '../types/WaitForOptions.js';

export const ChimericReadTestHarness = <TParams, TResult>({
  chimericRead,
  chimericMethod,
  params,
  wrapper,
}: {
  chimericRead: ChimericRead<TParams, TResult>;
  chimericMethod: (typeof chimericMethods)[number];
  params?: TParams;
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}): {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: TResult | undefined;
  };
} => {
  const result = {
    current: undefined as TResult | undefined,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result.current = chimericRead(params as any);
  const returnValue = {
    waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
      return new Promise<void>(async (resolve, reject) => {
        await checkOnInterval(
          () => {
            if (options?.reinvokeIdiomaticFn) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              result.current = chimericRead(params as any);
            }
            cb();
          },
          options?.interval ?? 1,
          options?.timeout ?? 3000,
          resolve,
          reject,
        );
      });
    },
    result,
  };
  if (chimericMethod === 'idiomatic') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result.current = chimericRead(params as any);
    return returnValue;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hook = renderHook(() => chimericRead.use(params as any), {
      wrapper,
    });
    return {
      waitFor: async (cb: () => void, options?: WaitForReadOptions) => {
        await waitFor(cb, {
          timeout: options?.timeout,
          interval: options?.interval,
        });
      },
      result: hook.result,
    };
  }
};
