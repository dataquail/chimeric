import { isIdiomaticAsync } from '../idiomatic/isIdiomaticAsync';
import { isReactiveAsync } from '../reactive/isReactiveAsync';
import { ChimericAsync } from './types';

export const isChimericAsync = <
  TParams extends void | object,
  TResult = unknown,
  E extends Error = Error,
>(
  maybeChimericAsync: unknown,
): maybeChimericAsync is ChimericAsync<TParams, TResult, E> => {
  return (
    isIdiomaticAsync(maybeChimericAsync) && isReactiveAsync(maybeChimericAsync)
  );
};
