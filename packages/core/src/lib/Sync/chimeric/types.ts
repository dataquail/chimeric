import { IdiomaticSync } from '../idiomatic/types';
import { ReactiveSync } from '../reactive/types';

export type ChimericSync<TParams, TResult> = IdiomaticSync<TParams, TResult> &
  ReactiveSync<TParams, TResult>;

export type DefineChimericSync<
  T extends (args: Parameters<T>[0]) => ReturnType<T>,
> = ChimericSync<Parameters<T>[0], ReturnType<T>>;
