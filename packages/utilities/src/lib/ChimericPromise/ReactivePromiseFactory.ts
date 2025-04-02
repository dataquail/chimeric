import { useEffect, useState } from 'react';
import {
  ReactivePromise,
  createReactivePromise,
  ReactivePromiseParamsOrOptions,
  ReactivePromiseOptionsOrNever,
} from '@chimeric/core';
import { getParamsAndOptionsFromReactivePromise } from '../utils';

export const ReactivePromiseFactory = <
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
>({
  promiseFn,
}: {
  promiseFn: (params: TParams) => Promise<TResult>;
}): ReactivePromise<TParams, TResult, E> => {
  const usePromise = (
    paramsOrOptions?: ReactivePromiseParamsOrOptions<TParams>,
    optionsOrNever?: ReactivePromiseOptionsOrNever<TParams>,
  ) => {
    const { params, options } = getParamsAndOptionsFromReactivePromise(
      paramsOrOptions,
      optionsOrNever,
    );

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
      if (options.invokeOnMount && !meta.isPending && !meta.isSuccess) {
        promiseFn(params as TParams)
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
    }, [options.invokeOnMount, meta, params]);

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
          const result = await promiseFn(params);
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
  };
  return createReactivePromise<TParams, TResult, E>(usePromise);
};
