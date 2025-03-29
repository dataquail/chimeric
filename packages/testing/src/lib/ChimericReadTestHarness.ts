/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericRead } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';
import { chimericMethods } from './chimericMethods.js';

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
  waitFor: (cb: () => void) => Promise<void>;
  result: {
    current: TResult | undefined;
  };
} => {
  const result = {
    current: undefined as TResult | undefined,
  };
  const returnValue = {
    waitFor: async (cb: () => void) => {
      return new Promise<void>(async (resolve, reject) => {
        await checkOnInterval(
          () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result.current = chimericRead(params as any);
            cb();
          },
          1,
          3000,
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
      waitFor: async (cb: () => void) => {
        await waitFor(cb);
      },
      result: hook.result,
    };
  }
};
