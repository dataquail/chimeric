import { useState } from 'react';
import { flushSync } from 'react-dom';
import {
  createReactiveAsync,
  ReactiveAsync,
  ReactiveAsyncInvokeOptions,
  ReactiveAsyncOptions,
} from '@chimeric/core';
import { executeWithRetry } from './utils';

export function ReactiveAsyncFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  asyncFn: (params: TParams) => Promise<TResult>,
): ReactiveAsync<TParams extends undefined ? void : TParams, TResult, TError> {
  const reactiveAsync = (hookOptions?: ReactiveAsyncOptions) => {
    const [meta, setMeta] = useState<{
      isIdle: boolean;
      isPending: boolean;
      isSuccess: boolean;
      isError: boolean;
      error: TError | null;
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
      invoke: async (
        paramsAndConfig: TParams & {
          options?: ReactiveAsyncInvokeOptions;
        } = {} as TParams & { options?: ReactiveAsyncInvokeOptions },
      ) => {
        const { options: invokeOptions, ...params } = paramsAndConfig;
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
            () => asyncFn(params as TParams),
            invokeOptions?.retry || hookOptions?.retry || 0,
          );
          flushSync(() => {
            setMeta({
              isIdle: false,
              isPending: false,
              isSuccess: true,
              isError: false,
              error: null,
              data: result,
            });
          });
          return result;
        } catch (error) {
          // Set error state only when executeWithRetry throws (after all retries are exhausted)
          flushSync(() => {
            setMeta({
              isIdle: false,
              isPending: false,
              isSuccess: false,
              isError: true,
              error: error as TError,
              data: undefined,
            });
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
  };

  return createReactiveAsync(
    reactiveAsync as ReactiveAsync<
      TParams extends undefined ? void : TParams,
      TResult,
      TError
    >['use'],
  );
}
