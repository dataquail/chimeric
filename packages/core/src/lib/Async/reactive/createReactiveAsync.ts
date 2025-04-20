import { isReactiveAsync } from './isReactiveAsync';
import { ReactiveAsync, ReactiveAsyncOptions } from './types';

// Overloads
export function createReactiveAsync<TResult = unknown, E extends Error = Error>(
  reactiveFn: (options?: ReactiveAsyncOptions) => {
    call: () => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  },
): ReactiveAsync<undefined, TResult, E>;
export function createReactiveAsync<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (options?: ReactiveAsyncOptions) => {
    call: (params: TParams) => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
  },
): ReactiveAsync<TParams, TResult, E>;

// Implementation
export function createReactiveAsync<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: ReactiveAsync<TParams, TResult, E>['useAsync'],
): ReactiveAsync<TParams, TResult, E> {
  const reactiveAsync = {
    useAsync: reactiveFn,
  };
  if (isReactiveAsync<TParams, TResult, E>(reactiveAsync)) {
    return reactiveAsync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive async');
  }
}
