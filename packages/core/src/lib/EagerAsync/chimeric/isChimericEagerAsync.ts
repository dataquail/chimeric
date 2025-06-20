import { isIdiomaticEagerAsync } from '../idiomatic/isIdiomaticEagerAsync';
import { isReactiveEagerAsync } from '../reactive/isReactiveEagerAsync';
import { ChimericEagerAsync } from './types';

export const isChimericEagerAsync = <TParams, TResult, E extends Error = Error>(
  maybeChimericAsync: unknown,
): maybeChimericAsync is ChimericEagerAsync<TParams, TResult, E> => {
  return (
    isIdiomaticEagerAsync(maybeChimericAsync) &&
    isReactiveEagerAsync(maybeChimericAsync)
  );
};
