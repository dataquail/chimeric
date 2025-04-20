import { isReactiveMutation } from './isReactiveMutation';
import { ReactiveMutation } from './types';

// Overloads
export function createReactiveMutation<
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: () => {
    call: () => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    reset: () => void;
  },
): ReactiveMutation<undefined, TResult, E>;
export function createReactiveMutation<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: () => {
    call: (params: TParams) => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    reset: () => void;
  },
): ReactiveMutation<TParams, TResult, E>;

// Implementation
export function createReactiveMutation<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: ReactiveMutation<TParams, TResult, E>['useMutation'],
): ReactiveMutation<TParams, TResult, E> {
  const reactiveMutation = {
    useMutation: reactiveFn,
  };
  if (isReactiveMutation<TParams, TResult, E>(reactiveMutation)) {
    return reactiveMutation;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
}
