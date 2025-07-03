/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeQueryHookWithoutParamsReturnsString,
  makeQueryHookWithParamsReturnsString,
  ReactiveQueryWithoutParamsReturnsString,
  ReactiveQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';
import { createReactiveQuery } from './createReactiveQuery';

describe('createReactiveQuery', () => {
  it('should create a reactive query function', () => {
    const mockReactiveFn = makeQueryHookWithoutParamsReturnsString();
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
    const mockReactiveFn = makeQueryHookWithParamsReturnsString();
    const reactiveQuery = createReactiveQuery(mockReactiveFn);
    const result = reactiveQuery.useQuery({ name: 'John' });

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBe(`Hello John`);
    expect(result.refetch).toBeDefined();
  });

  it('should invoke the reactive function without params', () => {
    const mockReactiveFn = makeQueryHookWithoutParamsReturnsString();
    const reactiveQuery = createReactiveQuery(mockReactiveFn);
    const result = reactiveQuery.useQuery();

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBe('test');
    expect(result.refetch).toBeDefined();
    expect(result.native).toBe('test');
  });

  it('should handle type annotations without params', () => {
    const mockReactiveFn = makeQueryHookWithoutParamsReturnsString();
    const reactiveQuery: ReactiveQueryWithoutParamsReturnsString =
      createReactiveQuery(mockReactiveFn);
    const result = reactiveQuery.useQuery();

    expect(result.isIdle).toBe(true);
  });

  it('should handle type annotations with params', () => {
    const mockReactiveFn = makeQueryHookWithParamsReturnsString();
    const reactiveQuery: ReactiveQueryWithParamsReturnsString =
      createReactiveQuery(mockReactiveFn);
    const result = reactiveQuery.useQuery({ name: 'John' });

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBe(`Hello John`);
    expect(result.refetch).toBeDefined();
  });
});
