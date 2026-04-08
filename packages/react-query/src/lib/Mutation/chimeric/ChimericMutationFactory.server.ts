import {
  type QueryClient,
  type MutationFunctionContext,
} from '@tanstack/react-query';
import { IdiomaticMutationFactory } from '../idiomatic/IdiomaticMutationFactory';
import { createReactiveMutation } from '../reactive/createReactiveMutation';
import { ChimericMutation } from './types';
import { fuseChimericMutation } from './fuseChimericMutation';
import { TanstackIdiomaticNativeOptions } from '../idiomatic/types';
import { throwHookServerError } from '../../serverErrors';

// Required params
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (
      params: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams, TResult, TError>,
): ChimericMutation<TParams, TResult, TError>;

// Optional params
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (
      params?: TParams,
      context?: MutationFunctionContext,
    ) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<TParams | undefined, TResult, TError>,
): ChimericMutation<TParams | undefined, TResult, TError>;

// No params
export function ChimericMutationFactory<
  TResult = unknown,
  TError extends Error = Error,
>(
  config: {
    queryClient: QueryClient;
    mutationFn: (context?: MutationFunctionContext) => Promise<TResult>;
  } & TanstackIdiomaticNativeOptions<void, TResult, TError>,
): ChimericMutation<void, TResult, TError>;

// Implementation
export function ChimericMutationFactory<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  queryClient,
  mutationFn,
  ...mutationOptions
}: {
  queryClient: QueryClient;
  mutationFn: (
    params: TParams,
    context?: MutationFunctionContext,
  ) => Promise<TResult>;
} & TanstackIdiomaticNativeOptions<TParams, TResult, TError>): ChimericMutation<
  TParams,
  TResult,
  TError
> {
  const idiomatic = IdiomaticMutationFactory({
    queryClient,
    mutationFn,
    ...mutationOptions,
  });
  const stubUseHook = () => throwHookServerError('useHook');
  const reactive = createReactiveMutation(stubUseHook);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fuseChimericMutation({ idiomatic, reactive } as any) as any;
}
