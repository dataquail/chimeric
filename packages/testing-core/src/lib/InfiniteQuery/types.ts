import { WaitForReadOptions } from 'src/types/WaitForOptions';
import { chimericMethods } from '../methods';

export type IdiomaticInfiniteQueryTestHarnessReturnType<
  TPageData = unknown,
  TPageParam = unknown,
  E extends Error = Error,
> = {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: {
      data: { pages: TPageData[]; pageParams: TPageParam[] } | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
    };
  };
};

export type ReactiveInfiniteQueryTestHarnessReturnType<
  TPageData = unknown,
  TPageParam = unknown,
  E extends Error = Error,
  TReactiveNativeReturnType = unknown,
> = {
  waitFor: (cb: () => void, options?: WaitForReadOptions) => Promise<void>;
  result: {
    current: {
      data: { pages: TPageData[]; pageParams: TPageParam[] } | undefined;
      isIdle: boolean;
      isSuccess: boolean;
      isPending: boolean;
      isError: boolean;
      error: E | null;
      isFetchingNextPage: boolean;
      isFetchingPreviousPage: boolean;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      fetchNextPage: () => Promise<{ pages: TPageData[]; pageParams: TPageParam[] }>;
      fetchPreviousPage: () => Promise<{ pages: TPageData[]; pageParams: TPageParam[] }>;
      refetch: () => Promise<{ pages: TPageData[]; pageParams: TPageParam[] }>;
      native: TReactiveNativeReturnType;
    };
  };
};

export type ChimericInfiniteQueryTestHarnessReturnType<
  TPageData = unknown,
  TPageParam = unknown,
  E extends Error = Error,
  TMethod = (typeof chimericMethods)[number],
  TReactiveNativeReturnType = unknown,
> = TMethod extends 'idiomatic'
  ? IdiomaticInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, E>
  : ReactiveInfiniteQueryTestHarnessReturnType<TPageData, TPageParam, E, TReactiveNativeReturnType>;