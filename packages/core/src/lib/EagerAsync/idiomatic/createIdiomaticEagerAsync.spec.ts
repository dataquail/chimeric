/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefineIdiomaticEagerAsync } from './types';
import { createIdiomaticEagerAsync } from './createIdiomaticEagerAsync';

describe('createIdiomaticEagerAsync', () => {
  it('should create an idiomatic eager async function', () => {
    const mockAsyncFn = vi.fn(async () => 'test');
    const idiomaticAsync = createIdiomaticEagerAsync(mockAsyncFn);
    expect(typeof idiomaticAsync).toBe('function');
    expect(idiomaticAsync).toBe(mockAsyncFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticEagerAsync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic eager async');
  });

  it('should handle type annotations with no params', async () => {
    type TestIdiomaticEagerAsync = DefineIdiomaticEagerAsync<
      () => Promise<string>
    >;
    const mockIdiomaticEagerAsync = vi.fn(async () => 'test');
    const testIdiomaticEagerAsync: TestIdiomaticEagerAsync =
      createIdiomaticEagerAsync(mockIdiomaticEagerAsync);
    const result = await testIdiomaticEagerAsync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    type TestIdiomaticEagerAsync = DefineIdiomaticEagerAsync<
      (args: { name: string }) => Promise<string>
    >;
    const mockIdiomaticEagerAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const testIdiomaticEagerAsync: TestIdiomaticEagerAsync =
      createIdiomaticEagerAsync(mockIdiomaticEagerAsync);
    const result = await testIdiomaticEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
