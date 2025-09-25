import { isEligibleIdiomatic } from '../../utilities/isEligibleIdiomatic';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { IdiomaticSync } from './types';

export const createIdiomaticSync = <TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => TResult,
): IdiomaticSync<TParams, TResult> => {
  if (isEligibleIdiomatic(idiomaticFn)) {
    return markIdiomatic(
      idiomaticFn,
      TYPE_MARKERS.IDIOMATIC_SYNC,
    ) as IdiomaticSync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic sync');
  }
};
