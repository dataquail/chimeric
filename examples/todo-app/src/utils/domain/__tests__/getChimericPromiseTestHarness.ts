/* eslint-disable no-async-promise-executor */
import { waitFor, renderHook } from '@testing-library/react';
import { ChimericPromise } from '../ChimericPromise';
import { checkOnInterval } from './checkOnInterval';
import { ReactNode } from 'react';

export const ChimericPromiseMethods = ['call', 'usePromise'] as const;

export const inferPromiseMethod = (method: string) => {
  if (method === 'call') {
    return 'call';
  }
  return 'usePromise';
};

export const getChimericPromiseTestHarness =
  (testWrapper: ({ children }: { children: ReactNode }) => JSX.Element) =>
  <
    TParams,
    TResult,
    E extends Error,
    ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
      ? never
      : object,
  >(
    chimericPromise: ChimericPromise<TParams, TResult, E, ErrorHelpers>,
    chimericMethod: (typeof ChimericPromiseMethods)[number],
  ): {
    waitForSuccess: () => Promise<void>;
    waitForError: () => Promise<void>;
    waitForPending: () => Promise<void>;
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
        call: async (args: TParams) => {
          result.current.isPending = true;
          return (
            chimericPromise
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .call(args as any)
              .then((data) => {
                result.current.data = data;
                result.current.isPending = false;
                result.current.isSuccess = true;
                result.current.isError = false;
                result.current.error = null;
                return data;
              })
              .catch((error) => {
                result.current.isPending = false;
                result.current.isSuccess = false;
                result.current.isError = true;
                result.current.error = error as E;
              })
          );
        },
        data: undefined as TResult | undefined,
        isSuccess: false,
        isPending: false,
        isError: false,
        error: null as E | null,
      },
    };
    if (chimericMethod === 'call') {
      return {
        waitForSuccess: async () => {
          return new Promise<void>(async (resolve) => {
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
      const hook = renderHook(() => chimericPromise.usePromise(), {
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
