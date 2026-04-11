// Re-export core types and utilities for convenience
export {
  // Async
  type DefineChimericAsync,
  type DefineReactiveAsync,
  type DefineIdiomaticAsync,
  type ChimericAsync,
  type ReactiveAsync,
  type IdiomaticAsync,
  isChimericAsync,
  isReactiveAsync,
  isIdiomaticAsync,
  fuseChimericAsync,
  createReactiveAsync,
  createIdiomaticAsync,
  // EagerAsync
  type DefineChimericEagerAsync,
  type DefineReactiveEagerAsync,
  type DefineIdiomaticEagerAsync,
  type ChimericEagerAsync,
  type ReactiveEagerAsync,
  type IdiomaticEagerAsync,
  isChimericEagerAsync,
  isReactiveEagerAsync,
  isIdiomaticEagerAsync,
  fuseChimericEagerAsync,
  createReactiveEagerAsync,
  createIdiomaticEagerAsync,
  // Sync
  type DefineChimericSync,
  type DefineReactiveSync,
  type DefineIdiomaticSync,
  type ChimericSync,
  type ReactiveSync,
  type IdiomaticSync,
  isChimericSync,
  isReactiveSync,
  isIdiomaticSync,
  fuseChimericSync,
  createReactiveSync,
  createIdiomaticSync,
} from '@chimeric/core';

// Vue-specific types
export type {
  VueReactiveAsyncReturn,
  VueReactiveAsync,
  VueDefineReactiveAsync,
  VueChimericAsync,
  VueDefineChimericAsync,
} from './lib/Async/types';

export type {
  VueReactiveEagerAsyncReturn,
  VueReactiveEagerAsync,
  VueDefineReactiveEagerAsync,
  VueChimericEagerAsync,
  VueDefineChimericEagerAsync,
} from './lib/EagerAsync/types';

// Vue-specific factories
export { IdiomaticAsyncFactory } from './lib/Async/IdiomaticAsyncFactory';
export { ReactiveAsyncFactory } from './lib/Async/ReactiveAsyncFactory';
export { ChimericAsyncFactory } from './lib/Async/ChimericAsyncFactory';

export { IdiomaticEagerAsyncFactory } from './lib/EagerAsync/IdiomaticEagerAsyncFactory';
export { ReactiveEagerAsyncFactory } from './lib/EagerAsync/ReactiveEagerAsyncFactory';
export { ChimericEagerAsyncFactory } from './lib/EagerAsync/ChimericEagerAsyncFactory';
