import { DefineChimericSync } from '../Sync/chimeric/types';
import { DefineIdiomaticSync } from '../Sync/idiomatic/types';
import { DefineReactiveSync } from '../Sync/reactive/types';

export type ChimericSyncWithoutParamsReturnsString = DefineChimericSync<
  () => string
>;

export type ChimericSyncWithParamsReturnsString = DefineChimericSync<
  (args: { name: string }) => string
>;

export type IdiomaticSyncWithoutParamsReturnsString = DefineIdiomaticSync<
  () => string
>;

export type IdiomaticSyncWithParamsReturnsString = DefineIdiomaticSync<
  (args: { name: string }) => string
>;

export type ReactiveSyncWithoutParamsReturnsString = DefineReactiveSync<
  () => string
>;

export type ReactiveSyncWithParamsReturnsString = DefineReactiveSync<
  (args: { name: string }) => string
>;

export type IdiomaticSyncWithParamsReturnsObj = DefineIdiomaticSync<
  (args: { name: string }) => { name: string }
>;

export type ReactiveSyncWithParamsReturnsObj = DefineReactiveSync<
  (args: { name: string }) => { name: string }
>;
