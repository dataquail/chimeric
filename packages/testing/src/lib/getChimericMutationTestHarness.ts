/* eslint-disable no-async-promise-executor */
import { JSX, ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { ChimericMutation } from '@chimeric/core';
import { checkOnInterval } from './checkOnInterval.js';

export const ChimericMutationMethods = ['call', 'useMutation'] as const;

export const inferMutationMethod = (method: string) => {
  if (method === 'call') {
    return 'call';
  }
  return 'useMutation';
};

export const getChimericMutationTestHarness =
  (testWrapper: ({ children }: { children: ReactNode }) => JSX.Element) =>
  <
    TParams,
    TResult,
    E extends Error,
    ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
      ? never
      : object,
  >(
    chimericMutation: ChimericMutation<TParams, TResult, E, ErrorHelpers>,
    chimericMethod: (typeof ChimericMutationMethods)[number],
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
    if (chimericMethod === 'call') {
      return {
        call: (args: TParams) => {
          result.current.isPending = true;
          result.current.isSuccess = false;
          result.current.isError = false;
          result.current.error = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const promise = chimericMutation.call(args as any);
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
          return new Promise<void>(async (resolve) => {
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
      const hook = renderHook(() => chimericMutation.useMutation(), {
        wrapper: testWrapper,
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
