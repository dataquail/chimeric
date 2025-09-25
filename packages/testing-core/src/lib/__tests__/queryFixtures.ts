import { createIdiomaticQuery, createReactiveQuery } from '@chimeric/core';

export const makeIdiomaticQueryWithoutParamsReturnsString = () =>
  createIdiomaticQuery(vi.fn(async () => 'test'));

export const makeIdiomaticQueryWithParamsReturnsString = () =>
  createIdiomaticQuery(
    vi.fn(async (args: { name: string }) => `Hello ${args.name}`),
  );

export const makeReactiveQueryWithoutParamsReturnsString = () =>
  createReactiveQuery(
    vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(),
      native: null,
    })),
  );

export const makeReactiveQueryWithParamsReturnsString = () =>
  createReactiveQuery(
    vi.fn((args: { name: string }) => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: `Hello ${args.name}`,
      refetch: vi.fn(),
      native: null,
    })),
  );
