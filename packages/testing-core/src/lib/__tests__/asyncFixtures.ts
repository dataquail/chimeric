import { createIdiomaticAsync } from '@chimeric/core';

export const makeIdiomaticAsyncWithoutParamsReturnsString = () =>
  createIdiomaticAsync(vi.fn(async () => 'test'));

export const makeReactiveAsyncWithoutParamsReturnsString = () =>
  vi.fn(() => ({
    invoke: vi.fn(() => Promise.resolve('test')),
    isIdle: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'test',
  }));

export const makeIdiomaticAsyncWithParamsReturnsString = () =>
  createIdiomaticAsync(
    vi.fn(async (args: { name: string }) => `Hello ${args.name}`),
  );

export const makeReactiveAsyncWithParamsReturnsString = () =>
  vi.fn(() => ({
    invoke: vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    ),
    isIdle: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'Hello John',
  }));
