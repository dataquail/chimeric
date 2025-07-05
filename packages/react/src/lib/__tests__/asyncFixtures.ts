import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsObj,
  makeAsyncFnWithParamsReturnsString,
} from './functionFixtures';
import {
  DefineChimericAsync,
  createIdiomaticAsync,
  DefineIdiomaticAsync,
  createReactiveAsync,
  DefineReactiveAsync,
} from '@chimeric/core';

// No params
export const makeIdiomaticAsyncWithoutParamsReturnsString = () =>
  createIdiomaticAsync(makeAsyncFnWithoutParamsReturnsString());

export const makeAsyncHookWithoutParamsReturnsString = () =>
  vi.fn(() => ({
    invoke: makeAsyncFnWithoutParamsReturnsString(),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: 'test',
  }));

export const makeReactiveAsyncWithoutParamsReturnsString = () =>
  createReactiveAsync(makeAsyncHookWithoutParamsReturnsString());

// With params
export const makeIdiomaticAsyncWithParamsReturnsString = () =>
  createIdiomaticAsync(makeAsyncFnWithParamsReturnsString());

export const makeAsyncHookWithParamsReturnsString = () =>
  vi.fn(() => ({
    invoke: makeAsyncFnWithParamsReturnsString(),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: `Hello John`,
  }));

export const makeReactiveAsyncWithParamsReturnsString = () =>
  createReactiveAsync(makeAsyncHookWithParamsReturnsString());

// With params and returns obj
export const makeIdiomaticAsyncWithParamsReturnsObj = () =>
  createIdiomaticAsync(makeAsyncFnWithParamsReturnsObj());

export const makeAsyncHookWithParamsReturnsObj = () =>
  vi.fn(() => ({
    invoke: makeAsyncFnWithParamsReturnsObj(),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: { name: 'John' },
  }));

export const makeReactiveAsyncWithParamsReturnsObj = () =>
  createReactiveAsync(makeAsyncHookWithParamsReturnsObj());

export type ChimericAsyncWithoutParamsReturnsString = DefineChimericAsync<
  () => Promise<string>
>;

export type ChimericAsyncWithParamsReturnsString = DefineChimericAsync<
  (args: { name: string }) => Promise<string>
>;

export type IdiomaticAsyncWithoutParamsReturnsString = DefineIdiomaticAsync<
  () => Promise<string>
>;

export type IdiomaticAsyncWithParamsReturnsString = DefineIdiomaticAsync<
  (args: { name: string }) => Promise<string>
>;

export type ReactiveAsyncWithoutParamsReturnsString = DefineReactiveAsync<
  () => Promise<string>
>;

export type ReactiveAsyncWithParamsReturnsString = DefineReactiveAsync<
  (args: { name: string }) => Promise<string>
>;

export type IdiomaticAsyncWithParamsReturnsObj = DefineIdiomaticAsync<
  (args: { name: string }) => Promise<{ name: string }>
>;

export type ReactiveAsyncWithParamsReturnsObj = DefineReactiveAsync<
  (args: { name: string }) => Promise<{ name: string }>
>;
