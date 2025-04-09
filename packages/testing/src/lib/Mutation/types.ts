import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type MutationTestHarness<
  TParams = void,
  TResult = void,
  E extends Error = Error,
> = TParams extends void
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
