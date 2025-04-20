import { IdiomaticSync } from '../idiomatic/types';
import { ReactiveSync } from '../reactive/types';
import { isChimericSync } from './isChimericSync';
import { ChimericSync } from './types';

export const fuseChimericSync = <TParams = undefined, TResult = unknown>(args: {
  idiomatic: IdiomaticSync<TParams, TResult>;
  reactive: ReactiveSync<TParams, TResult>;
}): ChimericSync<TParams, TResult> => {
  const chimericFn = args.idiomatic as ChimericSync<TParams, TResult>;
  chimericFn.useSync = args.reactive.useSync;
  if (isChimericSync<TParams, TResult>(chimericFn)) {
    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric sync');
  }
};
