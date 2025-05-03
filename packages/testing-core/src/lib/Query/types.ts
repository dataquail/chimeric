import { WaitForReadOptions } from 'src/types/WaitForOptions';
import { chimericMethods } from '../methods';

export type IdiomaticQueryTestHarnessReturnType<
  TResult = unknown,
  E extends Error = Error,
> = {
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

export type ReactiveQueryTestHarnessReturnType<
  TResult = unknown,
  E extends Error = Error,
  TReactiveNativeReturnType = unknown,
> = {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: {
      data: TResult | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
      native: TReactiveNativeReturnType;
    };
  };
};

export type ChimericQueryTestHarnessReturnType<
  TResult = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TReactiveNativeReturnType = unknown,
> = TMethod extends 'idiomatic'
  ? IdiomaticQueryTestHarnessReturnType<TResult, E>
  : ReactiveQueryTestHarnessReturnType<TResult, E, TReactiveNativeReturnType>;
