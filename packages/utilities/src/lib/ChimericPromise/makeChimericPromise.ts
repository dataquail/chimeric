import { useState } from 'react';
import { ChimericPromise } from '@chimeric/core';

export const makeChimericPromise = <
  TParams,
  TResult,
  E extends Error,
  ErrorHelpers = void extends { [K: string]: (error: unknown) => boolean }
    ? never
    : object,
>({
  promiseFn,
  errorHelpers,
}: {
  promiseFn: (args: TParams) => Promise<TResult>;
  errorHelpers: ErrorHelpers;
}): ChimericPromise<TParams, TResult, E, ErrorHelpers> => {
  return {
    call: promiseFn,
    usePromise: () => {
      const [meta, setMeta] = useState<{
        isPending: boolean;
        isSuccess: boolean;
        isError: boolean;
        error: E | null;
        data: TResult | undefined;
      }>({
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      });

      return {
        call: async (args) => {
          setMeta({
            isPending: true,
            isSuccess: false,
            isError: false,
            error: null,
            data: undefined,
          });
          try {
            const result = await promiseFn(args);
            setMeta({
              isPending: false,
              isSuccess: true,
              isError: false,
              error: null,
              data: result,
            });
            return result;
          } catch (error) {
            setMeta({
              isPending: false,
              isSuccess: false,
              isError: true,
              error: error as E,
              data: undefined,
            });
            throw error;
          }
        },
        isPending: meta.isPending,
        isSuccess: meta.isSuccess,
        isError: meta.isError,
        error: meta.error,
        data: meta.data,
      };
    },
    errorHelpers,
  };
};
