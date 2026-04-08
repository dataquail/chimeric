import { type MutationFunctionContext } from '@tanstack/react-query';
import { type ReactiveMutation } from './types';
import { TanstackMutationReactiveNativeOptions } from './types';
import { throwReactiveServerError } from '../../serverErrors';

// Required params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (
      params: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
  } & TanstackMutationReactiveNativeOptions<TParams, TResult, TError>,
): ReactiveMutation<TParams, TResult, TError>;

// Optional params
export function ReactiveMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (
      params?: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
  } & TanstackMutationReactiveNativeOptions<
    TParams | undefined,
    TResult,
    TError
  >,
): ReactiveMutation<TParams | undefined, TResult, TError>;

// No params
export function ReactiveMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    mutationFn: (context?: MutationFunctionContext) => Promise<TResult>;
  } & TanstackMutationReactiveNativeOptions<void, TResult, TError>,
): ReactiveMutation<void, TResult, TError>;

// Implementation
export function ReactiveMutationFactory(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config: { mutationFn: unknown },
): never {
  throwReactiveServerError('ReactiveMutationFactory');
}
