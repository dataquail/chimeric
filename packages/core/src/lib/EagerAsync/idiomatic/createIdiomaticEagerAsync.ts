import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticEagerAsync } from './types';

export function createIdiomaticEagerAsync<TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => Promise<TResult>,
): IdiomaticEagerAsync<TParams, TResult> {
  if (isEligibleIdiomatic(idiomaticFn)) {
    return markIdiomatic(
      idiomaticFn,
      TYPE_MARKERS.IDIOMATIC_EAGER_ASYNC,
    ) as IdiomaticEagerAsync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic eager async');
  }
}
