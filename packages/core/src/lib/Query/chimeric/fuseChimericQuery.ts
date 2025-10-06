import { ChimericQuery } from './types';
import { IdiomaticQuery } from '../idiomatic/types';
import { ReactiveQuery } from '../reactive/types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticQuery } from '../idiomatic/isIdiomaticQuery';
import { isReactiveQuery } from '../reactive/isReactiveQuery';

export function fuseChimericQuery<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
  TNativeIdiomaticOptions = unknown,
  TNativeReactiveOptions = unknown,
  TNativeReactiveResult = unknown,
>(args: {
  idiomatic: IdiomaticQuery<TParams, TResult, TNativeIdiomaticOptions>;
  reactive: ReactiveQuery<
    TParams,
    TResult,
    TError,
    TNativeReactiveOptions,
    TNativeReactiveResult
  >;
}): ChimericQuery<
  TParams,
  TResult,
  TError,
  TNativeIdiomaticOptions,
  TNativeReactiveOptions,
  TNativeReactiveResult
> {
  if (isIdiomaticQuery(args.idiomatic) && isReactiveQuery(args.reactive)) {
    const chimericFn = args.idiomatic as unknown as ChimericQuery<
      TParams,
      TResult,
      TError,
      TNativeIdiomaticOptions,
      TNativeReactiveOptions,
      TNativeReactiveResult
    >;
    chimericFn.use = args.reactive.use;
    markReactive(chimericFn, TYPE_MARKERS.REACTIVE_QUERY);
    markIdiomatic(chimericFn, TYPE_MARKERS.IDIOMATIC_QUERY);

    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric query');
  }
}
