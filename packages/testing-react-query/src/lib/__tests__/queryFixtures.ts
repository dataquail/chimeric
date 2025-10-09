import { IdiomaticQueryOptions, ReactiveQueryOptions } from '@chimeric/core';
import {
  createIdiomaticQuery,
  createReactiveQuery,
  TanstackQueryIdiomaticNativeOptions,
  TanstackQueryReactiveNativeOptions,
  TanstackQueryReactiveReturnType,
} from '@chimeric/react-query';

export const makeIdiomaticQueryWithoutParamsReturnsString = () =>
  createIdiomaticQuery(
    vi.fn(
      async (_allOptions?: {
        options?: IdiomaticQueryOptions;
        nativeOptions?: undefined;
      }) => 'test',
    ),
  );

export const makeIdiomaticQueryWithParamsReturnsString = () =>
  createIdiomaticQuery(
    vi.fn(
      async (
        args: { name: string },
        _allOptions?: {
          options?: IdiomaticQueryOptions;
          nativeOptions?: TanstackQueryIdiomaticNativeOptions<
            string,
            Error,
            string[]
          >;
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
          nativeOptions?: TanstackQueryIdiomaticNativeOptions<
            string,
            Error,
            string[]
          >;
        },
      ) => (args ? `Hello ${args.name}` : 'Hello'),
    ),
  );

export const makeReactiveQueryWithoutParamsReturnsString = () =>
  createReactiveQuery(
    vi.fn(
      (_allOptions?: {
        options?: ReactiveQueryOptions;
        nativeOptions?: TanstackQueryReactiveNativeOptions<
          string,
          Error,
          string[]
        >;
      }) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(),
        native: undefined as unknown as TanstackQueryReactiveReturnType<
          string,
          Error
        >,
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
          nativeOptions?: TanstackQueryReactiveNativeOptions<
            string,
            Error,
            string[]
          >;
        },
      ) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: `Hello ${args.name}`,
        refetch: vi.fn(),
        native: undefined as unknown as TanstackQueryReactiveReturnType<
          string,
          Error
        >,
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
          nativeOptions?: TanstackQueryReactiveNativeOptions<
            string,
            Error,
            string[]
          >;
        },
      ) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: args ? `Hello ${args.name}` : 'Hello',
        refetch: vi.fn(),
        native: undefined as unknown as TanstackQueryReactiveReturnType<
          string,
          Error
        >,
      }),
    ),
  );
