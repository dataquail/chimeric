import { useState } from 'react';
import { ReactiveAsync, ReactiveAsyncOptions } from '@chimeric/core';
import { executeWithRetry } from './utils';

interface ReactiveAsyncFactoryType {
  <TParams extends void, TResult = unknown, E extends Error = Error>(
    asyncFn: () => Promise<TResult>,
  ): ReactiveAsync<TParams, TResult, E>;
  <TParams extends object, TResult = unknown, E extends Error = Error>(
    asyncFn: (params: TParams) => Promise<TResult>,
  ): ReactiveAsync<TParams, TResult, E>;
}

export const ReactiveAsyncFactory: ReactiveAsyncFactoryType = <
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  asyncFn: TParams extends void
    ? () => Promise<TResult>
    : TParams extends object
    ? (params: TParams) => Promise<TResult>
    : never,
): ReactiveAsync<TParams, TResult, E> => {
  const reactiveAsync = {
    useAsync: (options?: ReactiveAsyncOptions) => {
      const [meta, setMeta] = useState<{
        isIdle: boolean;
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      }>({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      });

      return {
        call: async (params: TParams) => {
          setMeta({
            isIdle: false,
            isPending: true,
            isSuccess: false,
            isError: false,
            error: null,
            data: undefined,
          });
          try {
            const result = await executeWithRetry<TResult>(
              () => asyncFn(params as object),
              options?.retry,
            );
            setMeta({
              isIdle: false,
              isPending: false,
              isSuccess: true,
              isError: false,
              error: null,
              data: result,
            });
            return result;
          } catch (error) {
            setMeta({
              isIdle: false,
              isPending: false,
              isSuccess: false,
              isError: true,
              error: error as E,
              data: undefined,
            });
            throw error;
          }
        },
        isIdle: meta.isIdle,
        isPending: meta.isPending,
        isSuccess: meta.isSuccess,
        isError: meta.isError,
        error: meta.error,
        data: meta.data,
      };
    },
  };

  return reactiveAsync as ReactiveAsync<TParams, TResult, E>;
};
