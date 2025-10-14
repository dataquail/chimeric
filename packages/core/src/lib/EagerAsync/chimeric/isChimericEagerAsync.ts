import { isIdiomaticEagerAsync } from '../idiomatic/isIdiomaticEagerAsync';
import { IdiomaticEagerAsync } from '../idiomatic/types';
import { isReactiveEagerAsync } from '../reactive/isReactiveEagerAsync';
import { ChimericEagerAsync } from './types';

export const isChimericEagerAsync = <
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(
  maybeChimericAsync: ChimericEagerAsync<TParams, TResult, TError>,
): maybeChimericAsync is ChimericEagerAsync<TParams, TResult, TError> => {
  return (
    isIdiomaticEagerAsync(
      maybeChimericAsync as IdiomaticEagerAsync<TParams, TResult>,
    ) && isReactiveEagerAsync(maybeChimericAsync)
  );
};
