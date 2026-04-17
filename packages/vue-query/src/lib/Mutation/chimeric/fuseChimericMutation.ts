import {
  isIdiomaticMutation,
  markIdiomatic,
  markReactive,
  TYPE_MARKERS,
} from '@chimeric/core';
import { type ChimericMutation } from './types';
import { type IdiomaticMutation } from '../idiomatic/types';
import { type ReactiveMutation } from '../reactive/types';

// No params
export function fuseChimericMutation<
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomatic,
  reactive,
}: {
  idiomatic: IdiomaticMutation<void, TResult, TError>;
  reactive: ReactiveMutation<void, TResult, TError>;
}): ChimericMutation<void, TResult, TError>;

// Optional params
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomatic,
  reactive,
}: {
  idiomatic: IdiomaticMutation<TParams | undefined, TResult, TError>;
  reactive: ReactiveMutation<TParams | undefined, TResult, TError>;
}): ChimericMutation<TParams | undefined, TResult, TError>;

// Required params
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomatic,
  reactive,
}: {
  idiomatic: IdiomaticMutation<TParams, TResult, TError>;
  reactive: ReactiveMutation<TParams, TResult, TError>;
}): ChimericMutation<TParams, TResult, TError>;

// Implementation
export function fuseChimericMutation<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>({
  idiomatic,
  reactive,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idiomatic: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reactive: any;
}): ChimericMutation<TParams, TResult, TError> {
  if (!isIdiomaticMutation(idiomatic)) {
    throw new Error('idiomatic is not a valid idiomatic mutation');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chimericMutation = idiomatic as any;
  chimericMutation.useHook = reactive.useHook;

  markIdiomatic(chimericMutation, TYPE_MARKERS.IDIOMATIC_MUTATION);
  markReactive(chimericMutation, TYPE_MARKERS.REACTIVE_MUTATION);

  return chimericMutation as ChimericMutation<TParams, TResult, TError>;
}
