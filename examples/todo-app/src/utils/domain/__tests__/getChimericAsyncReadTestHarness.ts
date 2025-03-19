/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericAsyncRead } from '../ChimericAsyncRead';
import { checkOnInterval } from './checkOnInterval';
import { ReactNode } from 'react';

export const ChimericAsyncReadMethods = ['call', 'useAsync'] as const;

export const inferAsyncReadMethod = (method: string) => {
  if (method === 'call') {
    return 'call';
  }
  return 'useAsync';
};

export const getChimericAsyncReadTestHarness =
  (testWrapper: ({ children }: { children: ReactNode }) => JSX.Element) =>
  <
    TParams,
    TResult,
    E extends Error,
    ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
      ? never
      : object,
  >(
    chimericAsyncRead: ChimericAsyncRead<TParams, TResult, E, ErrorHelpers>,
    chimericMethod: (typeof ChimericAsyncReadMethods)[number],
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
      let promise = chimericAsyncRead.call(args as any);
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
        waitForSuccess: async () => {
          return new Promise<void>(async (resolve) => {
            if (promiseStatus === 'resolved') {
              // retry promise if it has already been resolved
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              promise = chimericAsyncRead.call(args as any);
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
              () => result.current.isSuccess,
              1,
              5000,
              resolve,
            );
          });
        },
        waitForError: async () => {
          return new Promise<void>(async (resolve) => {
            await promise;
            await checkOnInterval(
              () => result.current.isError,
              1,
              5000,
              resolve,
            );
          });
        },
        waitForPending: async () => {
          return new Promise<void>(async (resolve) => {
            await checkOnInterval(
              () => result.current.isPending,
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
      const hook = renderHook(() => chimericAsyncRead.useAsync(args as any), {
        wrapper: testWrapper,
      });
      return {
        waitForSuccess: async () => {
          await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
        },
        waitForError: async () => {
          await waitFor(() => expect(hook.result.current.isError).toBe(true));
        },
        waitForPending: async () => {
          await waitFor(() => expect(hook.result.current.isPending).toBe(true));
        },
        result: hook.result,
      };
    }
  };
