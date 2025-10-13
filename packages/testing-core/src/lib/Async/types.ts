import { ReactiveAsyncInvokeOptions } from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type AsyncTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      invoke: [TParams] extends [void]
        ? (options?: ReactiveAsyncInvokeOptions) => Promise<TResult>
        : void extends TParams
        ? (options?: ReactiveAsyncInvokeOptions) => Promise<TResult>
        : undefined extends TParams
        ? (
            params?: TParams,
            options?: ReactiveAsyncInvokeOptions,
          ) => Promise<TResult>
        : (
            params: TParams,
            options?: ReactiveAsyncInvokeOptions,
          ) => Promise<TResult>;
      isIdle: boolean;
      isPending: boolean;
      isSuccess: boolean;
      isError: boolean;
      error: TError | null;
      data: TResult | undefined;
    };
  };
};
