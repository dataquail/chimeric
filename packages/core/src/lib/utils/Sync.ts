import { IdiomaticSync, ReactiveSync, ChimericSync } from '../types/Sync';

export const fuseChimericSync = <TParams = void, TResult = unknown>(args: {
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

export const createIdiomaticSync = <TParams = void, TResult = unknown>(
  idiomaticFn: (params: TParams) => TResult,
): IdiomaticSync<TParams, TResult> => {
  if (isIdiomaticSync<TParams, TResult>(idiomaticFn)) {
    return idiomaticFn as IdiomaticSync<TParams, TResult>;
  } else {
    throw new Error('idiomaticFn is not qualified to be idiomatic sync');
  }
};

export const createReactiveSync = <TParams = void, TResult = unknown>(
  reactiveFn: (params: TParams) => TResult,
): ReactiveSync<TParams, TResult> => {
  const reactiveSync = {
    useSync: reactiveFn,
  };
  if (isReactiveSync<TParams, TResult>(reactiveSync)) {
    return reactiveSync;
  } else {
    throw new Error('reactiveFn is not qualified to be reactive sync');
  }
};

export const isIdiomaticSync = <TParams = void, TResult = unknown>(
  maybeIdiomaticAsync: unknown,
): maybeIdiomaticAsync is IdiomaticSync<TParams, TResult> => {
  return typeof maybeIdiomaticAsync === 'function';
};

export const isReactiveSync = <TParams = void, TResult = unknown>(
  maybeReactiveSync: unknown,
): maybeReactiveSync is ReactiveSync<TParams, TResult> => {
  return (
    (typeof maybeReactiveSync === 'function' ||
      typeof maybeReactiveSync === 'object') &&
    maybeReactiveSync !== null &&
    'useSync' in maybeReactiveSync &&
    typeof (maybeReactiveSync as ReactiveSync<TParams, TResult>).useSync ===
      'function'
  );
};

export const isChimericSync = <TParams = void, TResult = unknown>(
  maybeChimericSync: unknown,
): maybeChimericSync is ChimericSync<TParams, TResult> => {
  return (
    isIdiomaticSync(maybeChimericSync) && isReactiveSync(maybeChimericSync)
  );
};
