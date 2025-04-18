import { ReactiveMutation } from './types';

export const isReactiveMutation = <
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeReactiveMutation: unknown,
): maybeReactiveMutation is ReactiveMutation<TParams, TResult, E> => {
  return (
    (typeof maybeReactiveMutation === 'function' ||
      typeof maybeReactiveMutation === 'object') &&
    maybeReactiveMutation !== null &&
    'useMutation' in maybeReactiveMutation &&
    typeof (maybeReactiveMutation as ReactiveMutation<TParams, TResult, E>)
      .useMutation === 'function'
  );
};
