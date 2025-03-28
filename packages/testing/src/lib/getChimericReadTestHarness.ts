/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericRead } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';

export const ChimericReadMethods = ['call', 'use'] as const;

export const inferReadMethod = (method: string) => {
  if (method === 'call') {
    return 'call';
  }
  return 'use';
};

export const getChimericReadTestHarness =
  (testWrapper: ({ children }: { children: ReactNode }) => JSX.Element) =>
  <TParams, TResult>(
    chimericRead: ChimericRead<TParams, TResult>,
    chimericMethod: (typeof ChimericReadMethods)[number],
    params?: TParams,
  ): {
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
              result.current = chimericRead.call(params as any);
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
    if (chimericMethod === 'call') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.current = chimericRead.call(params as any);
      return returnValue;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hook = renderHook(() => chimericRead.use(params as any), {
        wrapper: testWrapper,
      });
      return {
        waitFor: async (cb: () => void) => {
          await waitFor(cb);
        },
        result: hook.result,
      };
    }
  };
