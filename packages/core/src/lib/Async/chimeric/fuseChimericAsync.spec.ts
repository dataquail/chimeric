import { DefineChimericAsync } from './types';
import { fuseChimericAsync } from './fuseChimericAsync';

describe('fuseChimericAsync', () => {
  it('should invoke the idiomatic async function', async () => {
    const mockIdiomaticAsync = vi.fn(async () => 'test');
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsync).toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsync.useAsync).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticAsync = vi.fn(async () => 'test');
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'test',
      })),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = testChimericAsync.useAsync();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'Hello John',
        reset: vi.fn(),
      })),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.useAsync().call({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const mockIdiomaticAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockCallFunction = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: mockCallFunction,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'Hello John',
        reset: vi.fn(),
      })),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.useAsync().call({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(mockCallFunction).toHaveBeenCalledWith({
      name: 'John',
    });
  });

  it('should invoke reactive with params and options', async () => {
    const mockIdiomaticAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'Hello John',
        reset: vi.fn(),
      })),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.useAsync({ retry: 0 }).call({
      name: 'John',
    });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 0 });
  });

  it('should invoke reactive without params but with options', async () => {
    const mockIdiomaticAsync = vi.fn(async () => 'test');
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'test',
        reset: vi.fn(),
      })),
    };
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });
    const result = await testChimericAsync.useAsync({ retry: 0 }).call();
    expect(result).toEqual('test');
    expect(mockIdiomaticAsync).not.toHaveBeenCalled();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 0 });
  });

  it('should handle type annotations without params', async () => {
    type TestChimericAsyncWithoutParams = DefineChimericAsync<
      () => Promise<string>
    >;
    const mockIdiomaticAsyncWithoutParams = vi.fn(async () => 'test');
    const mockReactiveAsyncWithoutParams = {
      useAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'test',
        reset: vi.fn(),
      })),
    };
    const testChimericAsyncWithoutParams: TestChimericAsyncWithoutParams =
      fuseChimericAsync({
        idiomatic: mockIdiomaticAsyncWithoutParams,
        reactive: mockReactiveAsyncWithoutParams,
      });
    const idiomaticResult = await testChimericAsyncWithoutParams();
    const reactiveResult = testChimericAsyncWithoutParams.useAsync();
    expect(idiomaticResult).toEqual('test');
    expect(mockIdiomaticAsyncWithoutParams).toHaveBeenCalled();
    expect(reactiveResult.data).toEqual('test');
    expect(mockReactiveAsyncWithoutParams.useAsync).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    type TestChimericAsyncWithParams = DefineChimericAsync<
      (args: { name: string }) => Promise<string>
    >;
    const mockIdiomaticAsyncWithParams = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveAsyncWithParams = {
      useAsync: vi.fn(() => ({
        call: vi.fn((args: { name: string }) =>
          Promise.resolve(`Hello ${args.name}`),
        ),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'Hello John',
        reset: vi.fn(),
      })),
    };
    const testChimericAsyncWithParams: TestChimericAsyncWithParams =
      fuseChimericAsync({
        idiomatic: mockIdiomaticAsyncWithParams,
        reactive: mockReactiveAsyncWithParams,
      });
    const idiomaticResult = await testChimericAsyncWithParams({ name: 'John' });
    const reactiveResult = testChimericAsyncWithParams.useAsync();
    expect(idiomaticResult).toEqual('Hello John');
    expect(mockIdiomaticAsyncWithParams).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsyncWithParams.useAsync).toHaveBeenCalled();
    expect(reactiveResult.data).toEqual('Hello John');
  });
});
