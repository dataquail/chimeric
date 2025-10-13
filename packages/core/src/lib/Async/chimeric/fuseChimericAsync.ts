import { IdiomaticAsync } from '../idiomatic/types';
import { ReactiveAsync } from '../reactive/types';
import { ChimericAsync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markIdiomatic } from '../../utilities/markIdiomatic';
import { markReactive } from '../../utilities/markReactive';
import { isIdiomaticAsync } from '../idiomatic/isIdiomaticAsync';
import { isReactiveAsync } from '../reactive/isReactiveAsync';

// No params
export function fuseChimericAsync<
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<void, TResult>;
  reactive: ReactiveAsync<void, TResult, TError>;
}): ChimericAsync<void, TResult, TError>;

// Optional params
export function fuseChimericAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams | undefined, TResult>;
  reactive: ReactiveAsync<TParams | undefined, TResult, TError>;
}): ChimericAsync<TParams | undefined, TResult, TError>;

// Required params
export function fuseChimericAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveAsync<TParams, TResult, TError>;
}): ChimericAsync<TParams, TResult, TError>;

// Implementation
export function fuseChimericAsync<
  TParams = void,
  TResult = unknown,
  TError extends Error = Error,
>(args: {
  idiomatic: IdiomaticAsync<TParams, TResult>;
  reactive: ReactiveAsync<TParams, TResult, TError>;
}): ChimericAsync<TParams, TResult, TError> {
  if (isIdiomaticAsync(args.idiomatic) && isReactiveAsync(args.reactive)) {
    const chimericFn = args.idiomatic as ChimericAsync<
      TParams,
      TResult,
      TError
    >;
    chimericFn.use = args.reactive.use;
    markReactive(chimericFn, TYPE_MARKERS.REACTIVE_ASYNC);
    markIdiomatic(chimericFn, TYPE_MARKERS.IDIOMATIC_ASYNC);

    return chimericFn;
  } else {
    throw new Error('chimericFn is not qualified to be chimeric async');
  }
}
