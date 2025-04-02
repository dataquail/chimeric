import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type MutationTestHarness<TParams, TResult, E extends Error> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      call: (args: TParams) => Promise<TResult | void>;
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
    };
  };
};
