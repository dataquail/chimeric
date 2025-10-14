import { IdiomaticEagerAsync } from '../idiomatic/types';
import { ReactiveEagerAsync } from '../reactive/types';
import { ChimericEagerAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticEagerAsync } from '../idiomatic/isIdiomaticEagerAsync';
import { isReactiveEagerAsync } from '../reactive/isReactiveEagerAsync';

// Required Params
export function fuseChimericEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<TParams, TResult>;
  reactive: ReactiveEagerAsync<TParams, TResult, TError>;
}): ChimericEagerAsync<TParams, TResult, TError>;

// Optional Params
export function fuseChimericEagerAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<TParams | undefined, TResult>;
  reactive: ReactiveEagerAsync<TParams | undefined, TResult, TError>;
}): ChimericEagerAsync<TParams | undefined, TResult, TError>;

// No Params
export function fuseChimericEagerAsync<
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticEagerAsync<void, TResult>;
  reactive: ReactiveEagerAsync<void, TResult, TError>;
}): ChimericEagerAsync<void, TResult, TError>;

// Implementation
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
