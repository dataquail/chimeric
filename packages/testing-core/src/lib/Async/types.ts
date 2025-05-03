import { BaseWaitForOptions } from 'src/types/WaitForOptions';

export type AsyncTestHarnessReturnType<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
> = {
  waitFor: (cb: () => void, options?: BaseWaitForOptions) => Promise<void>;
  result: {
    current: {
      call: TParams extends undefined
        ? () => Promise<TResult>
        : (params: TParams) => Promise<TResult>;
      isIdle: boolean;
      isPending: boolean;
      isSuccess: boolean;
      isError: boolean;
      error: E | null;
      data: TResult | undefined;
    };
  };
};
