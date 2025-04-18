/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveEagerAsync } from './createReactiveEagerAsync';
import { DefineReactiveEagerAsync } from './types';

describe('createReactiveEagerAsync', () => {
  it('should create a reactive eager async function', () => {
    const mockReactiveFn = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

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
    type MockReactiveFn = DefineReactiveEagerAsync<() => Promise<string>>;
    const mockReactiveFn = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveEagerAsync: MockReactiveFn =
      createReactiveEagerAsync(mockReactiveFn);
    expect(typeof reactiveEagerAsync).toBe('object');
    expect(reactiveEagerAsync).toHaveProperty('useEagerAsync');
    expect(typeof reactiveEagerAsync.useEagerAsync).toBe('function');
    expect(reactiveEagerAsync.useEagerAsync).toBe(mockReactiveFn);
  });

  it('should handle type annotations with params', () => {
    type MockReactiveFn = DefineReactiveEagerAsync<
      (args: { name: string }) => Promise<string>
    >;
    const mockReactiveFn = vi.fn(({ name }: { name: string }) => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: `Hello ${name}`,
    }));

    const reactiveEagerAsync: MockReactiveFn =
      createReactiveEagerAsync(mockReactiveFn);
    expect(typeof reactiveEagerAsync).toBe('object');
    expect(reactiveEagerAsync).toHaveProperty('useEagerAsync');
    expect(typeof reactiveEagerAsync.useEagerAsync).toBe('function');
    expect(reactiveEagerAsync.useEagerAsync).toBe(mockReactiveFn);
  });

  it('should invoke the reactive eager async function without params', async () => {
    const mockReactiveFn = vi.fn(() => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: 'test',
    }));

    const reactiveEagerAsync = createReactiveEagerAsync(mockReactiveFn);

    const result = reactiveEagerAsync.useEagerAsync();

    expect(result.data).toBe('test');
    expect(mockReactiveFn).toHaveBeenCalled();
  });

  it('should invoke the reactive eager async function with params', async () => {
    const mockReactiveFn = vi.fn(({ name }: { name: string }) => ({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: `Hello ${name}`,
    }));

    const reactiveEagerAsync = createReactiveEagerAsync(mockReactiveFn);

    const result = reactiveEagerAsync.useEagerAsync({ name: 'John' });

    expect(result.data).toBe('Hello John');
    expect(mockReactiveFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
