import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type MutationTestHarness<
  TParams extends object | undefined,
  TResult = unknown,
  E extends Error = Error,
> = TParams extends undefined
  ? {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          call: () => Promise<TResult>;
          data: TResult | undefined;
          isIdle: boolean;
          isSuccess: boolean;
          isPending: boolean;
          isError: boolean;
          error: E | null;
        };
      };
    }
  : {
      waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
      result: {
        current: {
          call: (args: TParams) => Promise<TResult>;
          data: TResult | undefined;
          isIdle: boolean;
          isSuccess: boolean;
          isPending: boolean;
          isError: boolean;
          error: E | null;
        };
      };
    };
