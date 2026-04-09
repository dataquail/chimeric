// re-export from @chimeric/core (all server-safe)
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

// Safe local exports (no hooks at module level)
export * from './lib/ChimericEagerAsync/MetaAggregatorFactory';
export * from './lib/Async/IdiomaticAsyncFactory';
export * from './lib/EagerAsync/IdiomaticEagerAsyncFactory';
export * from './lib/Sync/CreateChimericSyncFactory';
export * from './lib/Sync/createChimericSync';

// Server replacements (hook-using → server-safe)
export { ChimericAsyncFactory } from './lib/Async/ChimericAsyncFactory.server';
export { ReactiveAsyncFactory } from './lib/Async/ReactiveAsyncFactory.server';
export { ChimericEagerAsyncFactory } from './lib/EagerAsync/ChimericEagerAsyncFactory.server';
export { ReactiveEagerAsyncFactory } from './lib/EagerAsync/ReactiveEagerAsyncFactory.server';

// SyncReducer - idiomatic (safe)
export * from './lib/SyncReducer/IdiomaticSyncReducer';
// SyncReducer - server replacements
export { ChimericSyncReducer } from './lib/SyncReducer/ChimericSyncReducer.server';
export { ReactiveSyncReducer } from './lib/SyncReducer/ReactiveSyncReducer.server';
