import { useState } from 'react';
import { ChimericPromise, fuseChimericPromise } from '@chimeric/core';

export const ChimericPromiseFactory = <TParams, TResult, E extends Error>({
  promiseFn,
}: {
  promiseFn: (args: TParams) => Promise<TResult>;
}): ChimericPromise<TParams, TResult, E> => {
  return fuseChimericPromise({
    fn: promiseFn,
    usePromise: () => {
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
        call: async (args) => {
          setMeta({
            isIdle: false,
            isPending: true,
            isSuccess: false,
            isError: false,
            error: null,
            data: undefined,
          });
          try {
            const result = await promiseFn(args);
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
  });
};
