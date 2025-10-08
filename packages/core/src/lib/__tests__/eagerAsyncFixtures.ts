import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsObj,
  makeAsyncFnWithParamsReturnsString,
} from './functionFixtures';
import { DefineChimericEagerAsync } from '../EagerAsync/chimeric/types';
import { DefineIdiomaticEagerAsync } from '../EagerAsync/idiomatic/types';
import { DefineReactiveEagerAsync } from '../EagerAsync/reactive/types';
import { createIdiomaticEagerAsync } from '../EagerAsync/idiomatic/createIdiomaticEagerAsync';
import { createReactiveEagerAsync } from '../EagerAsync/reactive/createReactiveEagerAsync';

// No params
export const makeEagerAsyncFnWithoutParamsReturnsString = () =>
  makeAsyncFnWithoutParamsReturnsString();

export const makeIdiomaticEagerAsyncWithoutParamsReturnsString = () =>
  createIdiomaticEagerAsync(makeEagerAsyncFnWithoutParamsReturnsString());

export const makeEagerAsyncHookWithoutParamsReturnsString = () =>
  vi.fn(() => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'test',
  }));

export const makeReactiveEagerAsyncWithoutParamsReturnsString = () =>
  createReactiveEagerAsync(makeEagerAsyncHookWithoutParamsReturnsString());

// With params
export const makeEagerAsyncFnWithParamsReturnsString = () =>
  makeAsyncFnWithParamsReturnsString();

export const makeIdiomaticEagerAsyncWithParamsReturnsString = () =>
  createIdiomaticEagerAsync(makeEagerAsyncFnWithParamsReturnsString());

export const makeEagerAsyncHookWithParamsReturnsString = () =>
  vi.fn((args: { name: string }) => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: `Hello ${args.name}`,
  }));

export const makeEagerAsyncHookWithOptionalParamsReturnsString = () =>
  vi.fn((params?: { name: string }) => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: params ? `Hello ${params.name}` : 'Hello',
  }));

export const makeReactiveEagerAsyncWithParamsReturnsString = () =>
  createReactiveEagerAsync(makeEagerAsyncHookWithParamsReturnsString());

// With params and returns obj
export const makeEagerAsyncFnWithParamsReturnsObj = () =>
  makeAsyncFnWithParamsReturnsObj();

export const makeIdiomaticEagerAsyncWithParamsReturnsObj = () =>
  createIdiomaticEagerAsync(makeEagerAsyncFnWithParamsReturnsObj());

export const makeEagerAsyncHookWithParamsReturnsObj = () =>
  vi.fn(() => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: { name: 'John' },
  }));

export const makeReactiveEagerAsyncWithParamsReturnsObj = () =>
  createReactiveEagerAsync(makeEagerAsyncHookWithParamsReturnsObj());

export type ChimericEagerAsyncWithoutParamsReturnsString =
  DefineChimericEagerAsync<() => Promise<string>>;

export type ChimericEagerAsyncWithParamsReturnsString =
  DefineChimericEagerAsync<(args: { name: string }) => Promise<string>>;

export type IdiomaticEagerAsyncWithoutParamsReturnsString =
  DefineIdiomaticEagerAsync<() => Promise<string>>;

export type IdiomaticEagerAsyncWithParamsReturnsString =
  DefineIdiomaticEagerAsync<(args: { name: string }) => Promise<string>>;

export type ReactiveEagerAsyncWithoutParamsReturnsString =
  DefineReactiveEagerAsync<() => Promise<string>>;

export type ReactiveEagerAsyncWithParamsReturnsString =
  DefineReactiveEagerAsync<(args: { name: string }) => Promise<string>>;

export type IdiomaticEagerAsyncWithParamsReturnsObj = DefineIdiomaticEagerAsync<
  (args: { name: string }) => Promise<{ name: string }>
>;

export type ReactiveEagerAsyncWithParamsReturnsObj = DefineReactiveEagerAsync<
  (args: { name: string }) => Promise<{ name: string }>
>;
