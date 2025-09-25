import { IdiomaticSync } from '../idiomatic/types';
import { ReactiveSync } from '../reactive/types';
import { ChimericSync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticSync } from '../idiomatic/isIdiomaticSync';
import { isReactiveSync } from '../reactive/isReactiveSync';

export const fuseChimericSync = <TParams = void, TResult = unknown>(args: {
  idiomatic: IdiomaticSync<TParams, TResult>;
  reactive: ReactiveSync<TParams, TResult>;
}): ChimericSync<TParams, TResult> => {
  if (
    isIdiomaticSync(args.idiomatic) &&
    isReactiveSync(args.reactive)
  ) {
    const chimericFn = args.idiomatic as ChimericSync<TParams, TResult>;
    chimericFn.use = args.reactive.use;
    markReactive(chimericFn, TYPE_MARKERS.REACTIVE_SYNC);
    markIdiomatic(chimericFn, TYPE_MARKERS.IDIOMATIC_SYNC);

    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric sync');
  }
};
