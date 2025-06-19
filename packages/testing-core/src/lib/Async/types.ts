import { IdiomaticAsyncOptions } from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type AsyncTestHarnessReturnType<
  TParams,
  TResult,
  E extends Error = Error,
> = TParams extends undefined | { options: IdiomaticAsyncOptions }
  ? {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          call: () => Promise<TResult>;
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: E | null;
          data: TResult | undefined;
        };
      };
    }
  : TParams extends object
  ? {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          call: (params: TParams) => Promise<TResult>;
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: E | null;
          data: TResult | undefined;
        };
      };
    }
  : TParams extends unknown
  ? {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          call: () => Promise<TResult>;
          isIdle: boolean;
          isPending: boolean;
          isSuccess: boolean;
          isError: boolean;
          error: E | null;
          data: TResult | undefined;
        };
      };
    }
  : never;
