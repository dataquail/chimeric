import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsObj,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { DefineChimericMutation } from '../chimeric/types';
import { createIdiomaticMutation } from '../idiomatic/createIdiomaticMutation';
import { DefineIdiomaticMutation } from '../idiomatic/types';
import { createReactiveMutation } from '../reactive/createReactiveMutation';
import { DefineReactiveMutation } from '../reactive/types';

// No params
export const makeMutationFnWithoutParamsReturnsString = () =>
  makeAsyncFnWithoutParamsReturnsString();

export const makeIdiomaticMutationWithoutParamsReturnsString = () =>
  createIdiomaticMutation(makeMutationFnWithoutParamsReturnsString());

export const makeMutationHookWithoutParamsReturnsString = () =>
  vi.fn(() => ({
    invoke: makeAsyncFnWithoutParamsReturnsString(),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: 'test',
    reset: vi.fn(),
    native: 'test',
  }));

export const makeReactiveMutationWithoutParamsReturnsString = () =>
  createReactiveMutation(makeMutationHookWithoutParamsReturnsString());

// With params
export const makeMutationFnWithParamsReturnsString = () =>
  makeAsyncFnWithParamsReturnsString();

export const makeIdiomaticMutationWithParamsReturnsString = () =>
  createIdiomaticMutation(makeMutationFnWithParamsReturnsString());

export const makeMutationHookWithParamsReturnsString = () =>
  vi.fn(() => ({
    invoke: makeAsyncFnWithParamsReturnsString(),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: `Hello John`,
    reset: vi.fn(),
    native: 'test',
  }));

export const makeReactiveMutationWithParamsReturnsString = () =>
  createReactiveMutation(makeMutationHookWithParamsReturnsString());

// With params and returns obj
export const makeMutationFnWithParamsReturnsObj = () =>
  makeAsyncFnWithParamsReturnsObj();

export const makeIdiomaticMutationWithParamsReturnsObj = () =>
  createIdiomaticMutation(makeMutationFnWithParamsReturnsObj());

export const makeMutationHookWithParamsReturnsObj = () =>
  vi.fn(() => ({
    invoke: makeAsyncFnWithParamsReturnsObj(),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: { name: 'John' },
    reset: vi.fn(),
    native: 'test',
  }));

export const makeReactiveMutationWithParamsReturnsObj = () =>
  createReactiveMutation(makeMutationHookWithParamsReturnsObj());

export type ChimericMutationWithoutParamsReturnsString = DefineChimericMutation<
  () => Promise<string>
>;

export type ChimericMutationWithParamsReturnsString = DefineChimericMutation<
  (args: { name: string }) => Promise<string>
>;

export type IdiomaticMutationWithoutParamsReturnsString =
  DefineIdiomaticMutation<() => Promise<string>>;

export type IdiomaticMutationWithParamsReturnsString = DefineIdiomaticMutation<
  (args: { name: string }) => Promise<string>
>;

export type ReactiveMutationWithoutParamsReturnsString = DefineReactiveMutation<
  () => Promise<string>
>;

export type ReactiveMutationWithParamsReturnsString = DefineReactiveMutation<
  (args: { name: string }) => Promise<string>
>;

export type IdiomaticMutationWithParamsReturnsObj = DefineIdiomaticMutation<
  (args: { name: string }) => Promise<{ name: string }>
>;

export type ReactiveMutationWithParamsReturnsObj = DefineReactiveMutation<
  (args: { name: string }) => Promise<{ name: string }>
>;
