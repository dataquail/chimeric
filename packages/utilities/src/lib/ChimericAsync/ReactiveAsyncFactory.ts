import { useEffect, useState } from 'react';
import {
  ReactiveAsync,
  ReactiveAsyncOptions,
  isReactiveAsync,
} from '@chimeric/core';

export const ReactiveAsyncFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncFn: TParams extends Record<'options', any>
    ? never
    : TParams extends void
    ? () => Promise<TResult>
    : (params: TParams) => Promise<TResult>,
): ReactiveAsync<
  Parameters<typeof asyncFn>[0],
  Awaited<ReturnType<typeof asyncFn>>,
  E
> => {
  const reactiveAsync = {
    useAsync: (
      params: (TParams & { options?: ReactiveAsyncOptions }) | void,
    ) => {
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

      useEffect(() => {
        if (params?.options?.isEager && !meta.isPending && !meta.isSuccess) {
          asyncFn(params)
            .then((result) => {
              setMeta({
                isIdle: false,
                isPending: false,
                isSuccess: true,
                isError: false,
                error: null,
                data: result,
              });
            })
            .catch((error: unknown) => {
              setMeta({
                isIdle: false,
                isPending: false,
                isSuccess: false,
                isError: true,
                error: (error instanceof Error
                  ? error
                  : new Error(String(error))) as E,
                data: undefined,
              });
              throw error;
            });
        }
      }, [params?.options?.isEager, meta, params]);

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
            const result = await asyncFn(params);
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

  if (
    isReactiveAsync<
      Parameters<typeof asyncFn>[0],
      Awaited<ReturnType<typeof asyncFn>>,
      E
    >(reactiveAsync)
  ) {
    return reactiveAsync;
  } else {
    throw new Error('useAsync is not qualified to be reactive async');
  }
};
