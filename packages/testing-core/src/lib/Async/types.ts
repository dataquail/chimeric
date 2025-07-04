import { ReactiveAsyncInvokeOptions } from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type AsyncTestHarnessReturnType<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
> = TParams extends object
  ? Omit<TParams, 'options'> extends
      | undefined
      | { options?: ReactiveAsyncInvokeOptions }
    ? {
        waitFor: (
          cb: () => void,
          options?: BaseWaitForOptions,
        ) => Promise<void>;
        result: {
          current: {
            invoke: (config?: {
              options?: ReactiveAsyncInvokeOptions;
            }) => Promise<TResult>;
            isIdle: boolean;
            isPending: boolean;
            isSuccess: boolean;
            isError: boolean;
            error: E | null;
            data: TResult | undefined;
          };
        };
      }
    : {
        waitFor: (
          cb: () => void,
          options?: BaseWaitForOptions,
        ) => Promise<void>;
        result: {
          current: {
            invoke: (
              paramsAndConfig: TParams & {
                options?: ReactiveAsyncInvokeOptions;
              },
            ) => Promise<TResult>;
            isIdle: boolean;
            isPending: boolean;
            isSuccess: boolean;
            isError: boolean;
            error: E | null;
            data: TResult | undefined;
          };
        };
      }
  : TParams extends void
  ? {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          invoke: (config?: {
            options?: ReactiveAsyncInvokeOptions;
          }) => Promise<TResult>;
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
