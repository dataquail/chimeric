/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveQuery } from './createReactiveQuery';
import {
  makeQueryHookWithOptionalParamsReturnsString,
  makeQueryHookWithoutParamsReturnsString,
  makeQueryHookWithParamsReturnsString,
  ReactiveQueryWithOptionalParamsReturnsString,
  ReactiveQueryWithoutParamsReturnsString,
  ReactiveQueryWithParamsReturnsString,
} from '../__tests__/queryFixtures';

describe('createReactiveQuery', () => {
  it('should create a reactive query function', () => {
    const mockReactiveFn = makeQueryHookWithoutParamsReturnsString();
    const reactiveQuery = createReactiveQuery(mockReactiveFn);

    expect(typeof reactiveQuery).toBe('object');
    expect(reactiveQuery).toHaveProperty('use');
    expect(typeof reactiveQuery.use).toBe('function');
    expect(reactiveQuery.use).toBe(mockReactiveFn);
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
    const result = reactiveQuery.use({ name: 'John' });

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBe('Hello John');
    expect(result.refetch).toBeDefined();
  });

  it('should invoke the reactive function without params', () => {
    const mockReactiveFn = makeQueryHookWithoutParamsReturnsString();
    const reactiveQuery = createReactiveQuery(mockReactiveFn);
    const result = reactiveQuery.use();

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBe('test');
    expect(result.refetch).toBeDefined();
    expect(result.native).toBeDefined();
  });

  it('should handle type annotations without params', () => {
    const mockReactiveFn = makeQueryHookWithoutParamsReturnsString();
    const reactiveQuery: ReactiveQueryWithoutParamsReturnsString =
      createReactiveQuery(mockReactiveFn);
    const result = reactiveQuery.use();

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
  });

  it('should handle type annotations with params', () => {
    const mockReactiveFn = makeQueryHookWithParamsReturnsString();
    const reactiveQuery: ReactiveQueryWithParamsReturnsString =
      createReactiveQuery(mockReactiveFn);
    const result = reactiveQuery.use({ name: 'John' });

    expect(result.isIdle).toBe(true);
    expect(result.isPending).toBe(false);
    expect(result.isSuccess).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.error).toBeNull();
    expect(result.data).toBe('Hello John');
    expect(result.refetch).toBeDefined();
  });

  it('should handle optional params', () => {
    const mockReactiveFn = makeQueryHookWithOptionalParamsReturnsString();
    const reactiveQuery = createReactiveQuery(mockReactiveFn);
    const resultWithParams = reactiveQuery.use({ name: 'John' });
    const resultWithoutParams = reactiveQuery.use();

    expect(resultWithParams.isIdle).toBe(true);
    expect(resultWithParams.isPending).toBe(false);
    expect(resultWithParams.isSuccess).toBe(true);
    expect(resultWithParams.isError).toBe(false);
    expect(resultWithParams.error).toBeNull();
    expect(resultWithParams.data).toBe('Hello John');
    expect(resultWithParams.refetch).toBeDefined();

    expect(resultWithoutParams.isIdle).toBe(true);
    expect(resultWithoutParams.isPending).toBe(false);
    expect(resultWithoutParams.isSuccess).toBe(true);
    expect(resultWithoutParams.isError).toBe(false);
    expect(resultWithoutParams.error).toBeNull();
    expect(resultWithoutParams.data).toBe('Hello');
    expect(resultWithoutParams.refetch).toBeDefined();
    expect(resultWithoutParams.native).toBeDefined();
  });

  it('should handle type annotations with optional params', () => {
    const mockReactiveFn = makeQueryHookWithOptionalParamsReturnsString();
    const reactiveQuery: ReactiveQueryWithOptionalParamsReturnsString =
      createReactiveQuery(mockReactiveFn);
    const resultWithParams = reactiveQuery.use({ name: 'John' });
    const resultWithoutParams = reactiveQuery.use();

    expect(resultWithParams.isIdle).toBe(true);
    expect(resultWithParams.isPending).toBe(false);
    expect(resultWithParams.isSuccess).toBe(true);
    expect(resultWithParams.isError).toBe(false);
    expect(resultWithParams.error).toBeNull();
    expect(resultWithParams.data).toBe('Hello John');
    expect(resultWithParams.refetch).toBeDefined();
    expect(resultWithParams.native).toBeDefined();

    expect(resultWithoutParams.isIdle).toBe(true);
    expect(resultWithoutParams.isPending).toBe(false);
    expect(resultWithoutParams.isSuccess).toBe(true);
    expect(resultWithoutParams.isError).toBe(false);
    expect(resultWithoutParams.error).toBeNull();
    expect(resultWithoutParams.data).toBe('Hello');
    expect(resultWithoutParams.refetch).toBeDefined();
    expect(resultWithoutParams.native).toBeDefined();
  });
});
