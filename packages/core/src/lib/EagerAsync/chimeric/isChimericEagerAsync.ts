import { isIdiomaticEagerAsync } from '../idiomatic/isIdiomaticEagerAsync';
import { isReactiveEagerAsync } from '../reactive/isReactiveEagerAsync';
import { ChimericEagerAsync } from './types';

export const isChimericEagerAsync = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  maybeChimericAsync: unknown,
): maybeChimericAsync is ChimericEagerAsync<TParams, TResult, TError> => {
  return (
    isIdiomaticEagerAsync(maybeChimericAsync) &&
    isReactiveEagerAsync(maybeChimericAsync)
  );
};
