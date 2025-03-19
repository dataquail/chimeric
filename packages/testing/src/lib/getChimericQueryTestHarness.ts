/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericQuery } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';
import { JSX, ReactNode } from 'react';

export const ChimericQueryMethods = ['call', 'useQuery'] as const;

export const inferQueryMethod = (method: string) => {
  if (method === 'call') {
    return 'call';
  }
  return 'useQuery';
};

export const getChimericQueryTestHarness =
  (testWrapper: ({ children }: { children: ReactNode }) => JSX.Element) =>
  <
    TParams,
    TResult,
    E extends Error,
    ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
      ? never
      : object,
  >(
    chimericQuery: ChimericQuery<TParams, TResult, E, ErrorHelpers>,
    chimericMethod: (typeof ChimericQueryMethods)[number],
    args?: TParams,
  ) => {
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
    if (chimericMethod === 'call') {
      result.current.isPending = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let promise = chimericQuery.call(args as any);
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
          return new Promise<void>(async (resolve) => {
            if (promiseStatus === 'resolved') {
              // retry promise if it has already been resolved
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              promise = chimericQuery.call(args as any);
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
              1,
              5000,
              resolve,
            );
          });
        },
        waitForError: async (cb: () => void) => {
          return new Promise<void>(async (resolve) => {
            await promise;
            await checkOnInterval(
              cb,
              1,
              5000,
              resolve,
            );
          });
        },
        waitForPending: async (cb: () => void) => {
          return new Promise<void>(async (resolve) => {
            await checkOnInterval(
              cb,
              1,
              5000,
              resolve,
            );
          });
        },
        result,
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hook = renderHook(() => chimericQuery.useQuery(args as any), {
        wrapper: testWrapper,
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
