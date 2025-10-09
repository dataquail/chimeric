import {
  makeSyncFnWithParamsReturnsObj,
  makeSyncFnWithParamsReturnsString,
  makeSyncFnWithoutParamsReturnsString,
  makeSyncFnWithOptionalParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { DefineChimericSync } from '../chimeric/types';
import { createIdiomaticSync } from '../idiomatic/createIdiomaticSync';
import { DefineIdiomaticSync } from '../idiomatic/types';
import { createReactiveSync } from '../reactive/createReactiveSync';
import { DefineReactiveSync } from '../reactive/types';

// No params
export const makeIdiomaticSyncWithoutParamsReturnsString = () =>
  createIdiomaticSync(makeSyncFnWithoutParamsReturnsString());

export const makeReactiveSyncWithoutParamsReturnsString = () =>
  createReactiveSync(makeSyncFnWithoutParamsReturnsString());

// With params
export const makeIdiomaticSyncWithParamsReturnsString = () =>
  createIdiomaticSync(makeSyncFnWithParamsReturnsString());

export const makeSyncHookWithParamsReturnsString = () =>
  makeSyncFnWithParamsReturnsString();

export const makeReactiveSyncWithParamsReturnsString = () =>
  createReactiveSync(makeSyncHookWithParamsReturnsString());

// With params and returns obj
export const makeIdiomaticSyncWithParamsReturnsObj = () =>
  createIdiomaticSync(makeSyncFnWithParamsReturnsObj());

export const makeSyncHookWithParamsReturnsObj = () =>
  makeSyncFnWithParamsReturnsObj();

export const makeReactiveSyncWithParamsReturnsObj = () =>
  createReactiveSync(makeSyncHookWithParamsReturnsObj());

// With optional params
export const makeIdiomaticSyncWithOptionalParamsReturnsString = () =>
  createIdiomaticSync(makeSyncFnWithOptionalParamsReturnsString());

export const makeReactiveSyncWithOptionalParamsReturnsString = () =>
  createReactiveSync(makeSyncFnWithOptionalParamsReturnsString());

// Types
export type ChimericSyncWithoutParamsReturnsString = DefineChimericSync<
  () => Promise<string>
>;

export type ChimericSyncWithParamsReturnsString = DefineChimericSync<
  (args: { name: string }) => Promise<string>
>;

export type IdiomaticSyncWithoutParamsReturnsString = DefineIdiomaticSync<
  () => Promise<string>
>;

export type IdiomaticSyncWithParamsReturnsString = DefineIdiomaticSync<
  (args: { name: string }) => Promise<string>
>;

export type ReactiveSyncWithoutParamsReturnsString = DefineReactiveSync<
  () => Promise<string>
>;

export type ReactiveSyncWithParamsReturnsString = DefineReactiveSync<
  (args: { name: string }) => Promise<string>
>;

export type IdiomaticSyncWithParamsReturnsObj = DefineIdiomaticSync<
  (args: { name: string }) => Promise<{ name: string }>
>;

export type ReactiveSyncWithParamsReturnsObj = DefineReactiveSync<
  (args: { name: string }) => Promise<{ name: string }>
>;
