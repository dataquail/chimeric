/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeAsyncHookWithoutParamsReturnsString,
  makeAsyncHookWithParamsReturnsString,
  ReactiveAsyncWithoutParamsReturnsString,
  ReactiveAsyncWithParamsReturnsString,
} from '../__tests__/asyncFixtures';
import { createReactiveAsync } from './createReactiveAsync';

describe('createReactiveAsync', () => {
  it('should create a reactive async function', () => {
    const mockReactiveFn = makeAsyncHookWithoutParamsReturnsString();

    const reactiveAsync = createReactiveAsync(mockReactiveFn);

    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('use');
    expect(typeof reactiveAsync.use).toBe('function');
    expect(reactiveAsync.use).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveAsync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive async');
  });

  it('should handle type annotations with no params', async () => {
    const mockReactiveFn = makeAsyncHookWithoutParamsReturnsString();

    const reactiveAsync: ReactiveAsyncWithoutParamsReturnsString =
      createReactiveAsync(mockReactiveFn);
    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('use');
    expect(typeof reactiveAsync.use).toBe('function');
    expect(reactiveAsync.use).toBe(mockReactiveFn);
    const result = await reactiveAsync.use().invoke();
    expect(result).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    const mockReactiveFn = makeAsyncHookWithParamsReturnsString();

    const reactiveAsync: ReactiveAsyncWithParamsReturnsString =
      createReactiveAsync(mockReactiveFn);
    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('use');
    expect(typeof reactiveAsync.use).toBe('function');
    expect(reactiveAsync.use).toBe(mockReactiveFn);
    const result = await reactiveAsync.use().invoke({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('should invoke the reactive async function without params', async () => {
    const mockReactiveFn = makeAsyncHookWithoutParamsReturnsString();
    const reactiveAsync = createReactiveAsync(mockReactiveFn);

    const result = reactiveAsync.use();
    const callResult = await result.invoke();

    expect(callResult).toBe('test');
    expect(result.invoke).toHaveBeenCalled();
  });

  it('should invoke the reactive async function with params', async () => {
    const mockReactiveFn = makeAsyncHookWithParamsReturnsString();
    const reactiveAsync = createReactiveAsync(mockReactiveFn);

    const result = reactiveAsync.use();
    const callResult = await result.invoke({ name: 'John' });

    expect(callResult).toBe('Hello John');
    expect(result.invoke).toHaveBeenCalledWith({ name: 'John' });
  });
});
