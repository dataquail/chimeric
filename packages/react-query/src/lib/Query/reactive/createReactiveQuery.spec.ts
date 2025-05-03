/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveQuery } from './createReactiveQuery';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { ReactiveQueryOptions } from '@chimeric/core';

describe('createReactiveQuery', () => {
  it('should create a reactive query function', () => {
    const mockReactiveFn = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(() => Promise.resolve('test')),
      native: {} as UseQueryResult<string, Error>,
    }));

    const reactiveQuery = createReactiveQuery(mockReactiveFn);

    expect(typeof reactiveQuery).toBe('object');
    expect(reactiveQuery).toHaveProperty('useQuery');
    expect(typeof reactiveQuery.useQuery).toBe('function');
    expect(reactiveQuery.useQuery).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveQuery(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive query');
  });

  it('should invoke the reactive function with params', () => {
    const mockReactiveFn = vi.fn(
      (params: {
        name: string;
        options?: ReactiveQueryOptions;
        nativeOptions?: UseQueryOptions<string, Error, string, any>;
      }) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        refetch: vi.fn(() => Promise.resolve(`Hello ${params.name}`)),
        native: {} as UseQueryResult<string, Error>,
      }),
    );

    const reactiveQuery = createReactiveQuery(mockReactiveFn);

    const result = reactiveQuery.useQuery({ name: 'John' });

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(false);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBeUndefined();
    expect(result.refetch).toBeDefined();
  });

  it('should invoke the reactive function without params', () => {
    const mockReactiveFn = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      refetch: vi.fn(() => Promise.resolve('test')),
      native: {} as UseQueryResult<string, Error>,
    }));

    const reactiveQuery = createReactiveQuery(mockReactiveFn);

    const result = reactiveQuery.useQuery();

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(false);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBeUndefined();
    expect(result.refetch).toBeDefined();
    expect(result.native).toBeDefined();
  });
});
