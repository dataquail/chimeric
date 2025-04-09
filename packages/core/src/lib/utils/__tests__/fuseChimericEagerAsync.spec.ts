import { DefineChimericEagerAsync } from '../../types/EagerAsync';
import { fuseChimericEagerAsync } from '../EagerAsync';

describe('fuseChimericEagerAsync', () => {
  it('should invoke the idiomatic async function', async () => {
    type TestChimericEagerAsync = DefineChimericEagerAsync<
      () => Promise<string>,
      Error
    >;
    const mockIdiomaticEagerAsync = vi.fn(async () => 'test');
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
    const testChimericEagerAsync: TestChimericEagerAsync =
      fuseChimericEagerAsync({
        idiomatic: mockIdiomaticEagerAsync,
        reactive: mockReactiveEagerAsync,
      });
    const result = await testChimericEagerAsync();
    expect(result).toEqual('test');
    expect(mockIdiomaticEagerAsync).toHaveBeenCalled();
    expect(mockReactiveEagerAsync.useEagerAsync).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const mockIdiomaticEagerAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn((args: { name: string }) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: `Hello ${args.name}`,
      })),
    };
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = await testChimericEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticEagerAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveEagerAsync.useEagerAsync).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const mockIdiomaticEagerAsync = vi.fn(async () => 'test');
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn(() => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: 'test',
      })),
    };
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = testChimericEagerAsync.useEagerAsync();
    expect(result.data).toEqual('test');
    expect(mockIdiomaticEagerAsync).not.toHaveBeenCalled();
    expect(mockReactiveEagerAsync.useEagerAsync).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const mockIdiomaticEagerAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn((args: { name: string }) => ({
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: `Hello ${args.name}`,
      })),
    };
    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticEagerAsync,
      reactive: mockReactiveEagerAsync,
    });
    const result = testChimericEagerAsync.useEagerAsync({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(mockIdiomaticEagerAsync).not.toHaveBeenCalled();
    expect(mockReactiveEagerAsync.useEagerAsync).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
