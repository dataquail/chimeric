/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveAsync } from './createReactiveAsync';
import { DefineReactiveAsync } from './types';

describe('createReactiveAsync', () => {
  it('should create a reactive async function', () => {
    const mockReactiveFn = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveAsync = createReactiveAsync(mockReactiveFn);

    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('useAsync');
    expect(typeof reactiveAsync.useAsync).toBe('function');
    expect(reactiveAsync.useAsync).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveAsync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive async');
  });

  it('should handle type annotations with no params', async () => {
    type TestReactiveAsync = DefineReactiveAsync<() => Promise<string>>;
    const mockReactiveFn = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveAsync: TestReactiveAsync =
      createReactiveAsync(mockReactiveFn);
    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('useAsync');
    expect(typeof reactiveAsync.useAsync).toBe('function');
    expect(reactiveAsync.useAsync).toBe(mockReactiveFn);
    const result = await reactiveAsync.useAsync().call();
    expect(result).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    type TestReactiveAsync = DefineReactiveAsync<
      (args: { name: string }) => Promise<string>
    >;
    const mockReactiveFn = vi.fn(() => ({
      call: vi.fn((args: { name: string }) =>
        Promise.resolve(`Hello ${args.name}`),
      ),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveAsync: TestReactiveAsync =
      createReactiveAsync(mockReactiveFn);
    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('useAsync');
    expect(typeof reactiveAsync.useAsync).toBe('function');
    expect(reactiveAsync.useAsync).toBe(mockReactiveFn);
    const result = await reactiveAsync.useAsync().call({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('should invoke the reactive async function without params', async () => {
    const mockCall = vi.fn(() => Promise.resolve('test'));
    const mockReactiveFn = vi.fn(() => ({
      call: mockCall,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveAsync = createReactiveAsync(mockReactiveFn);

    const result = await reactiveAsync.useAsync().call();

    expect(result).toBe('test');
    expect(mockCall).toHaveBeenCalled();
  });

  it('should invoke the reactive async function with params', async () => {
    const mockCall = vi.fn((params: { name: string }) =>
      Promise.resolve(`Hello ${params.name}`),
    );
    const mockReactiveFn = vi.fn(() => ({
      call: mockCall,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveAsync = createReactiveAsync(mockReactiveFn);
    const result = await reactiveAsync.useAsync().call({ name: 'John' });
    expect(result).toBe('Hello John');
    expect(mockCall).toHaveBeenCalledWith({ name: 'John' });
  });
});
