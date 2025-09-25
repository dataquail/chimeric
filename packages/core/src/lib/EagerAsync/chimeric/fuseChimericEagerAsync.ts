import { IdiomaticEagerAsync } from '../idiomatic/types';
import { ReactiveEagerAsync } from '../reactive/types';
import { ChimericEagerAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticEagerAsync } from '../idiomatic/isIdiomaticEagerAsync';
import { isReactiveEagerAsync } from '../reactive/isReactiveEagerAsync';

export function fuseChimericEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<TParams, TResult>;
  reactive: ReactiveEagerAsync<TParams, TResult, TError>;
}): ChimericEagerAsync<TParams, TResult, TError> {
  if (
    isIdiomaticEagerAsync(args.idiomatic) &&
    isReactiveEagerAsync(args.reactive)
  ) {
    const chimericFn = args.idiomatic as ChimericEagerAsync<
      TParams,
      TResult,
      TError
    >;
    chimericFn.use = args.reactive.use;
    markReactive(chimericFn, TYPE_MARKERS.REACTIVE_EAGER_ASYNC);
    markIdiomatic(chimericFn, TYPE_MARKERS.IDIOMATIC_EAGER_ASYNC);

    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric eager async');
  }
}
