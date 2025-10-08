import { isEligibleReactive } from '../../utilities/isEligibleReactive';
import { ReactiveSync } from './types';
import { TYPE_MARKERS } from '../../utilities/typeMarkers';
import { markReactive } from '../../utilities/markReactive';

// Required params
export function createReactiveSync<TParams, TResult>(
  reactiveFn: (params: TParams) => TResult,
): ReactiveSync<TParams, TResult>;

// no params
export function createReactiveSync<TResult>(
  reactiveFn: () => TResult,
): ReactiveSync<void, TResult>;

// Optional params
export function createReactiveSync<TParams, TResult>(
  reactiveFn: (params?: TParams) => TResult,
): ReactiveSync<TParams | undefined, TResult>;

// Implementation
export function createReactiveSync<TParams = void, TResult = unknown>(
  reactiveFn: (params?: TParams) => TResult,
): ReactiveSync<TParams, TResult> {
  const reactiveSync = {
    use: reactiveFn,
  };
  if (isEligibleReactive(reactiveSync)) {
    return markReactive(reactiveSync, TYPE_MARKERS.REACTIVE_SYNC);
  } else {
    throw new Error('reactiveFn is not qualified to be reactive sync');
  }
}

// export const createReactiveSync = <TParams = void, TResult = unknown>(
//   reactiveFn: ReactiveSync<TParams, TResult>['use'],
// ): ReactiveSync<TParams, TResult> => {
//   const reactiveSync = {
//     use: reactiveFn,
//   };
//   if (isEligibleReactive(reactiveSync)) {
//     return markReactive(reactiveSync, TYPE_MARKERS.REACTIVE_SYNC);
//   } else {
//     throw new Error('reactiveFn is not qualified to be reactive sync');
//   }
// };
