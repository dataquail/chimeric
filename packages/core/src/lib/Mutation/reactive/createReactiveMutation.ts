import { isReactiveMutation } from './isReactiveMutation';
import { ReactiveMutation, ReactiveMutationOptions } from './types';

// Overloads
export function createReactiveMutation<
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: (config?: {
    options?: ReactiveMutationOptions;
    nativeOptions?: TNativeOptions;
  }) => {
    call: () => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    reset: () => void;
    native: TNativeReturnType;
  },
): ReactiveMutation<undefined, TResult, E, TNativeOptions, TNativeReturnType>;
export function createReactiveMutation<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: (config?: {
    options?: ReactiveMutationOptions;
    nativeOptions?: TNativeOptions;
  }) => {
    call: (params: TParams) => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    reset: () => void;
    native: TNativeReturnType;
  },
): ReactiveMutation<TParams, TResult, E, TNativeOptions, TNativeReturnType>;

// Implementation
export function createReactiveMutation<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
  TNativeOptions = unknown,
  TNativeReturnType = unknown,
>(
  reactiveFn: ReactiveMutation<
    TParams,
    TResult,
    E,
    TNativeOptions,
    TNativeReturnType
  >['useMutation'],
): ReactiveMutation<TParams, TResult, E, TNativeOptions, TNativeReturnType> {
  const reactiveMutation = {
    useMutation: reactiveFn,
  };
  if (
    isReactiveMutation<TParams, TResult, E, TNativeOptions, TNativeReturnType>(
      reactiveMutation,
    )
  ) {
    return reactiveMutation;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive mutation');
  }
}
