import {
  makeAsyncFnWithOptionalParamsReturnsString,
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsObj,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { DefineChimericQuery } from '../chimeric/types';
import { createIdiomaticQuery } from '../idiomatic/createIdiomaticQuery';
import { DefineIdiomaticQuery } from '../idiomatic/types';
import { createReactiveQuery } from '../reactive/createReactiveQuery';
import { DefineReactiveQuery } from '../reactive/types';

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
    native: 'test',
  }));

export const makeReactiveQueryWithoutParamsReturnsString = () =>
  createReactiveQuery(makeQueryHookWithoutParamsReturnsString());

// With params
export const makeQueryFnWithParamsReturnsString = () =>
  makeAsyncFnWithParamsReturnsString();

export const makeIdiomaticQueryWithParamsReturnsString = () =>
  createIdiomaticQuery(makeQueryFnWithParamsReturnsString());

// With optional params
export const makeQueryFnWithOptionalParamsReturnsString = () =>
  makeAsyncFnWithOptionalParamsReturnsString();

export const makeIdiomaticQueryWithOptionalParamsReturnsString = () =>
  createIdiomaticQuery(makeQueryFnWithOptionalParamsReturnsString());

export const makeQueryHookWithParamsReturnsString = () =>
  vi.fn((args: { name: string }) => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: `Hello ${args.name}`,
    refetch: vi.fn(() => Promise.resolve(`Hello ${args.name}`)),
    native: 'test',
  }));

export const makeQueryHookWithOptionalParamsReturnsString = () =>
  vi.fn((args?: { name: string }) => ({
    isIdle: true,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: args?.name ? `Hello ${args.name}` : 'Hello',
    refetch: vi.fn(() =>
      Promise.resolve(args?.name ? `Hello ${args.name}` : 'Hello'),
    ),
    native: 'test',
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
    native: 'test',
  }));

export const makeReactiveQueryWithParamsReturnsObj = () =>
  createReactiveQuery(makeQueryHookWithParamsReturnsObj());

export const makeReactiveQueryWithOptionalParamsReturnsString = () =>
  createReactiveQuery(makeQueryHookWithOptionalParamsReturnsString());

export type ChimericQueryWithoutParamsReturnsString = DefineChimericQuery<
  () => Promise<string>
>;

export type ChimericQueryWithParamsReturnsString = DefineChimericQuery<
  (args: { name: string }) => Promise<string>
>;

export type ChimericQueryWithOptionalParamsReturnsString = DefineChimericQuery<
  (args?: { name: string }) => Promise<string>
>;

export type IdiomaticQueryWithoutParamsReturnsString = DefineIdiomaticQuery<
  () => Promise<string>
>;

export type IdiomaticQueryWithParamsReturnsString = DefineIdiomaticQuery<
  (args: { name: string }) => Promise<string>
>;

export type IdiomaticQueryWithOptionalParamsReturnsString =
  DefineIdiomaticQuery<(args?: { name: string }) => Promise<string>>;

export type ReactiveQueryWithoutParamsReturnsString = DefineReactiveQuery<
  () => Promise<string>
>;

export type ReactiveQueryWithParamsReturnsString = DefineReactiveQuery<
  (args: { name: string }) => Promise<string>
>;

export type ReactiveQueryWithOptionalParamsReturnsString = DefineReactiveQuery<
  (args?: { name: string }) => Promise<string>
>;

export type IdiomaticQueryWithParamsReturnsObj = DefineIdiomaticQuery<
  (args: { name: string }) => Promise<{ name: string }>
>;

export type ReactiveQueryWithParamsReturnsObj = DefineReactiveQuery<
  (args: { name: string }) => Promise<{ name: string }>
>;
