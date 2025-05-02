import { WaitForReadOptions } from 'src/types/WaitForOptions';

export type SyncTestHarnessReturnType<TResult> = {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: TResult | undefined;
  };
};
