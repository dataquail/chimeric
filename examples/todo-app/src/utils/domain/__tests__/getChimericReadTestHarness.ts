/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericRead } from '../ChimericRead';
import { checkOnInterval } from './checkOnInterval';
import { ReactNode } from 'react';

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
    waitFor: (cb: () => boolean) => Promise<void>;
    result: {
      current: TResult | undefined;
    };
  } => {
    const returnValue = {
      waitFor: async (cb: () => boolean) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        returnValue.result = { current: chimericRead.call(params as any) };
        return new Promise<void>(async (resolve) => {
          await checkOnInterval(cb, 1, 5000, resolve);
        });
      },
      result: {
        current: undefined as TResult | undefined,
      },
    };
    if (chimericMethod === 'call') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      returnValue.result = { current: chimericRead.call(params as any) };
      return returnValue;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hook = renderHook(() => chimericRead.use(params as any), {
        wrapper: testWrapper,
      });
      return {
        waitFor: async (cb: () => boolean) => {
          await waitFor(cb);
        },
        result: hook.result,
      };
    }
  };
