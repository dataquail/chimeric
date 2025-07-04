/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeEagerAsyncHookWithoutParamsReturnsString,
  makeEagerAsyncHookWithParamsReturnsString,
  ReactiveEagerAsyncWithoutParamsReturnsString,
  ReactiveEagerAsyncWithParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';
import { createReactiveEagerAsync } from './createReactiveEagerAsync';

describe('createReactiveEagerAsync', () => {
  it('should create a reactive eager async function', () => {
    const mockReactiveFn = makeEagerAsyncHookWithoutParamsReturnsString();
    const reactiveEagerAsync = createReactiveEagerAsync(mockReactiveFn);

    expect(typeof reactiveEagerAsync).toBe('object');
    expect(reactiveEagerAsync).toHaveProperty('useEagerAsync');
    expect(typeof reactiveEagerAsync.useEagerAsync).toBe('function');
    expect(reactiveEagerAsync.useEagerAsync).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveEagerAsync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive eager async');
  });

  it('should handle type annotations with no params', () => {
    const mockReactiveFn = makeEagerAsyncHookWithoutParamsReturnsString();
    const reactiveEagerAsync: ReactiveEagerAsyncWithoutParamsReturnsString =
      createReactiveEagerAsync(mockReactiveFn);
    expect(typeof reactiveEagerAsync).toBe('object');
    expect(reactiveEagerAsync).toHaveProperty('useEagerAsync');
    expect(typeof reactiveEagerAsync.useEagerAsync).toBe('function');
    expect(reactiveEagerAsync.useEagerAsync).toBe(mockReactiveFn);
  });

  it('should handle type annotations with params', () => {
    const mockReactiveFn = makeEagerAsyncHookWithParamsReturnsString();
    const reactiveEagerAsync: ReactiveEagerAsyncWithParamsReturnsString =
      createReactiveEagerAsync(mockReactiveFn);
    expect(typeof reactiveEagerAsync).toBe('object');
    expect(reactiveEagerAsync).toHaveProperty('useEagerAsync');
    expect(typeof reactiveEagerAsync.useEagerAsync).toBe('function');
    expect(reactiveEagerAsync.useEagerAsync).toBe(mockReactiveFn);
  });

  it('should invoke the reactive eager async function without params', async () => {
    const mockReactiveFn = makeEagerAsyncHookWithoutParamsReturnsString();
    const reactiveEagerAsync = createReactiveEagerAsync(mockReactiveFn);
    const result = reactiveEagerAsync.useEagerAsync();

    expect(result.data).toBe('test');
    expect(mockReactiveFn).toHaveBeenCalled();
  });

  it('should invoke the reactive eager async function with params', async () => {
    const mockReactiveFn = makeEagerAsyncHookWithParamsReturnsString();
    const reactiveEagerAsync = createReactiveEagerAsync(mockReactiveFn);
    const result = reactiveEagerAsync.useEagerAsync({ name: 'John' });

    expect(result.data).toBe('Hello John');
    expect(mockReactiveFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
