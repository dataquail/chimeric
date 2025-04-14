import { WaitForReadOptions } from 'src/types/WaitForOptions';

export type EagerAsyncTestHarness<TResult, E extends Error> = {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: {
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
    };
  };
};
