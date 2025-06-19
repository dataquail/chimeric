import { useState } from 'react';
import {
  createReactiveAsync,
  ReactiveAsync,
  ReactiveAsyncOptions,
} from '@chimeric/core';
import { executeWithRetry } from './utils';

export function ReactiveAsyncFactory<TParams, TResult, E extends Error = Error>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ReactiveAsync<TParams, TResult, E> {
  return createReactiveAsync((options?: ReactiveAsyncOptions) => {
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
            () => asyncFn(params),
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
  });
}
