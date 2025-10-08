import {
  createIdiomaticQuery,
  createReactiveQuery,
  IdiomaticQueryOptions,
  ReactiveQueryOptions,
} from '@chimeric/core';

export const makeIdiomaticQueryWithoutParamsReturnsString = () =>
  createIdiomaticQuery(
    vi.fn(
      async (
        _noarg: void,
        _allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: undefined;
        },
      ) => 'test',
    ),
  );

export const makeIdiomaticQueryWithParamsReturnsString = () =>
  createIdiomaticQuery(
    vi.fn(
      async (
        args: { name: string },
        _allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: undefined;
        },
      ) => `Hello ${args.name}`,
    ),
  );

export const makeIdiomaticQueryWithOptionalParamsReturnsString = () =>
  createIdiomaticQuery(
    vi.fn(
      async (
        args?: { name: string },
        _allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: undefined;
        },
      ) => (args ? `Hello ${args.name}` : 'Hello'),
    ),
  );

export const makeReactiveQueryWithoutParamsReturnsString = () =>
  createReactiveQuery(
    vi.fn(
      (
        _noarg: void,
        _allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: undefined;
        },
      ) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(),
        native: null,
      }),
    ),
  );

export const makeReactiveQueryWithParamsReturnsString = () =>
  createReactiveQuery(
    vi.fn(
      (
        args: { name: string },
        _allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: undefined;
        },
      ) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: `Hello ${args.name}`,
        refetch: vi.fn(),
        native: null,
      }),
    ),
  );

export const makeReactiveQueryWithOptionalParamsReturnsString = () =>
  createReactiveQuery(
    vi.fn(
      (
        args?: { name: string },
        _allOptions?: {
          options?: ReactiveQueryOptions;
          nativeOptions?: undefined;
        },
      ) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: args ? `Hello ${args.name}` : 'Hello',
        refetch: vi.fn(),
        native: null,
      }),
    ),
  );
