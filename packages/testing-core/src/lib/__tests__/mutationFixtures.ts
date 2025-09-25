import {
  createIdiomaticMutation,
  createReactiveMutation,
} from '@chimeric/core';

export const makeIdiomaticMutationWithoutParamsReturnsString = () =>
  createIdiomaticMutation(vi.fn(async () => 'test'));

export const makeReactiveMutationWithoutParamsReturnsString = () =>
  createReactiveMutation(
    vi.fn(() => ({
      invoke: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: vi.fn(() => Promise.resolve()),
      native: null,
    })),
  );

export const makeIdiomaticMutationWithParamsReturnsString = () =>
  createIdiomaticMutation(
    vi.fn(async (args: { name: string }) => `Hello ${args.name}`),
  );

export const makeReactiveMutationWithParamsReturnsString = () =>
  createReactiveMutation(
    vi.fn(() => ({
      invoke: vi.fn((args: { name: string }) =>
        Promise.resolve(`Hello ${args.name}`),
      ),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'Hello John',
      reset: vi.fn(() => Promise.resolve()),
      native: null,
    })),
  );
