import { isIdiomaticSync } from '../idiomatic/isIdiomaticSync';
import { isReactiveSync } from '../reactive/isReactiveSync';
import { ChimericSync } from './types';

export const isChimericSync = <TParams = void, TResult = unknown>(
  maybeChimericSync: unknown,
): maybeChimericSync is ChimericSync<TParams, TResult> => {
  return (
    isIdiomaticSync(maybeChimericSync) && isReactiveSync(maybeChimericSync)
  );
};
