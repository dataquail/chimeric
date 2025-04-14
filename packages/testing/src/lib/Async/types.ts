import { ReactiveAsyncOptions } from '@chimeric/core';
import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type AsyncTestHarness<
  TParams = void,
  TResult = unknown,
  E extends Error = Error,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      call: TParams extends void
        ? () => Promise<TResult>
        : TParams extends { options: ReactiveAsyncOptions }
        ? never
        : (params: TParams) => Promise<TResult>;
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
    };
  };
};
