import { WaitForReadOptions } from 'src/types/WaitForOptions';

export type EagerAsyncTestHarnessReturnType<
  TResult = unknown,
  TError extends Error = Error,
> = {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: {
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: TError | null;
    };
  };
};
