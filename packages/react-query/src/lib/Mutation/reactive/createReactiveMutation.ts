import {
  type ReactiveMutationOptions,
  type ReactiveMutationCallOptions,
  createReactiveMutation as coreCreateReactiveMutation,
  type ReactiveMutation as CoreReactiveMutation,
} from '@chimeric/core';
import { type ReactiveMutation } from './types';
import {
  type UseMutationOptions,
  type UseMutationResult,
  type MutationOptions,
} from '@tanstack/react-query';

// Overloads
export function createReactiveMutation<
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (config?: {
    options?: ReactiveMutationOptions;
    nativeOptions?: Omit<
      UseMutationOptions<TResult, E, undefined>,
      'mutationFn'
    >;
  }) => {
    call: (params?: {
      options?: ReactiveMutationCallOptions;
      nativeOptions?: MutationOptions<TResult, E, undefined>;
    }) => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    reset: () => void;
    native: UseMutationResult<TResult, E, undefined>;
  },
): ReactiveMutation<undefined, TResult, E>;
export function createReactiveMutation<
  TParams extends object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: (config?: {
    options?: ReactiveMutationOptions;
    nativeOptions?: Omit<UseMutationOptions<TResult, E, TParams>, 'mutationFn'>;
  }) => {
    call: (
      params: TParams & {
        options?: ReactiveMutationCallOptions;
        nativeOptions?: MutationOptions<TResult, E, TParams>;
      },
    ) => Promise<TResult>;
    isIdle: boolean;
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: E | null;
    data: TResult | undefined;
    reset: () => void;
    native: UseMutationResult<TResult, E, TParams>;
  },
): ReactiveMutation<TParams, TResult, E>;

// Implementation
export function createReactiveMutation<
  TParams extends undefined | object,
  TResult = unknown,
  E extends Error = Error,
>(
  reactiveFn: CoreReactiveMutation<
    TParams,
    TResult,
    E,
    Omit<UseMutationOptions<TResult, E, TParams>, 'mutationFn'>,
    MutationOptions<TResult, E, TParams>,
    UseMutationResult<TResult, E, TParams>
  >['useMutation'],
): ReactiveMutation<TParams, TResult, E> {
  return coreCreateReactiveMutation(reactiveFn) as ReactiveMutation<
    TParams,
    TResult,
    E
  >;
}
