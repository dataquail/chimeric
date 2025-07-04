import { isIdiomaticAsync } from '../idiomatic/isIdiomaticAsync';
import { isReactiveAsync } from '../reactive/isReactiveAsync';
import { ChimericAsync } from './types';

export const isChimericAsync = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  maybeChimericAsync: unknown,
): maybeChimericAsync is ChimericAsync<TParams, TResult, TError> => {
  return (
    isIdiomaticAsync(maybeChimericAsync) && isReactiveAsync(maybeChimericAsync)
  );
};
