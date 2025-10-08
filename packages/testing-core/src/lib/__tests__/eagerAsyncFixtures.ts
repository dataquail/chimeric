import {
  createIdiomaticEagerAsync,
  createReactiveEagerAsync,
} from '@chimeric/core';

export const makeIdiomaticEagerAsyncWithoutParamsReturnsString = () =>
  createIdiomaticEagerAsync(vi.fn(async () => 'test'));

export const makeIdiomaticEagerAsyncWithParamsReturnsString = () =>
  createIdiomaticEagerAsync(
    vi.fn(async (args: { name: string }) => `Hello ${args.name}`),
  );

export const makeIdiomaticEagerAsyncWithOptionalParamsReturnsString = () =>
  createIdiomaticEagerAsync(
    vi.fn(async (args?: { name: string }) =>
      args?.name ? `Hello ${args?.name}` : 'Hello',
    ),
  );

export const makeReactiveEagerAsyncWithoutParamsReturnsString = () =>
  createReactiveEagerAsync(
    vi.fn(() => ({
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: 'test',
    })),
  );

export const makeReactiveEagerAsyncWithParamsReturnsString = () =>
  createReactiveEagerAsync(
    vi.fn((args: { name: string }) => ({
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: `Hello ${args.name}`,
    })),
  );

export const makeReactiveEagerAsyncWithOptionalParamsReturnsString = () =>
  createReactiveEagerAsync(
    vi.fn((args?: { name: string }) => ({
      isIdle: false,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
      data: args?.name ? `Hello ${args?.name}` : 'Hello',
    })),
  );
