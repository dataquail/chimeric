import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsObj,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { DefineChimericQuery } from '../chimeric/types';
import { createIdiomaticQuery } from '../idiomatic/createIdiomaticQuery';
import { DefineIdiomaticQuery } from '../idiomatic/types';
import { createReactiveQuery } from '../reactive/createReactiveQuery';
import {
  DefineReactiveQuery,
  TanstackQueryReactiveReturnType,
} from '../reactive/types';

// No params
export const makeQueryFnWithoutParamsReturnsString = () =>
  makeAsyncFnWithoutParamsReturnsString();

export const makeIdiomaticQueryWithoutParamsReturnsString = () =>
  createIdiomaticQuery(makeQueryFnWithoutParamsReturnsString());

export const makeQueryHookWithoutParamsReturnsString = () =>
  vi.fn(() => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'test',
    refetch: vi.fn(() => Promise.resolve('test')),
    native: {} as TanstackQueryReactiveReturnType<string, Error>,
  }));

export const makeReactiveQueryWithoutParamsReturnsString = () =>
  createReactiveQuery(makeQueryHookWithoutParamsReturnsString());

// With params
export const makeQueryFnWithParamsReturnsString = () =>
  makeAsyncFnWithParamsReturnsString();

export const makeIdiomaticQueryWithParamsReturnsString = () =>
  createIdiomaticQuery(makeQueryFnWithParamsReturnsString());

export const makeQueryHookWithParamsReturnsString = () =>
  vi.fn((args: { name: string }) => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: `Hello ${args.name}`,
    refetch: vi.fn(() => Promise.resolve(`Hello ${args.name}`)),
    native: {} as TanstackQueryReactiveReturnType<string, Error>,
  }));

export const makeReactiveQueryWithParamsReturnsString = () =>
  createReactiveQuery(makeQueryHookWithParamsReturnsString());

// With params and returns obj
export const makeQueryFnWithParamsReturnsObj = () =>
  makeAsyncFnWithParamsReturnsObj();

export const makeIdiomaticQueryWithParamsReturnsObj = () =>
  createIdiomaticQuery(makeQueryFnWithParamsReturnsObj());

export const makeQueryHookWithParamsReturnsObj = () =>
  vi.fn(() => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: { name: 'John' },
    refetch: vi.fn(() => Promise.resolve({ name: 'John' })),
    native: {} as TanstackQueryReactiveReturnType<{ name: string }, Error>,
  }));

export const makeReactiveQueryWithParamsReturnsObj = () =>
  createReactiveQuery(makeQueryHookWithParamsReturnsObj());

export type ChimericQueryWithoutParamsReturnsString = DefineChimericQuery<
  () => Promise<string>,
  Error,
  string[]
>;

export type ChimericQueryWithParamsReturnsString = DefineChimericQuery<
  (args: { name: string }) => Promise<string>,
  Error,
  string[]
>;

export type IdiomaticQueryWithoutParamsReturnsString = DefineIdiomaticQuery<
  () => Promise<string>,
  Error,
  string[]
>;

export type IdiomaticQueryWithParamsReturnsString = DefineIdiomaticQuery<
  (args: { name: string }) => Promise<string>,
  Error,
  string[]
>;

export type ReactiveQueryWithoutParamsReturnsString = DefineReactiveQuery<
  () => Promise<string>,
  Error,
  string[]
>;

export type ReactiveQueryWithParamsReturnsString = DefineReactiveQuery<
  (args: { name: string }) => Promise<string>,
  Error,
  string[]
>;

export type IdiomaticQueryWithParamsReturnsObj = DefineIdiomaticQuery<
  (args: { name: string }) => Promise<{ name: string }>
>;

export type ReactiveQueryWithParamsReturnsObj = DefineReactiveQuery<
  (args: { name: string }) => Promise<{ name: string }>
>;
