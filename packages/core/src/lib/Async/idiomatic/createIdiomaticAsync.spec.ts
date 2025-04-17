/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefineIdiomaticAsync } from './types';
import { createIdiomaticAsync } from './createIdiomaticAsync';

describe('createIdiomaticAsync', () => {
  it('should create an idiomatic async function', () => {
    const mockAsyncFn = vi.fn(async () => 'test');
    const idiomaticAsync = createIdiomaticAsync(mockAsyncFn);
    expect(typeof idiomaticAsync).toBe('function');
    expect(idiomaticAsync).toBe(mockAsyncFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticAsync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic async');
  });

  it('should handle type annotations with no params', async () => {
    type TestIdiomaticAsync = DefineIdiomaticAsync<() => Promise<string>>;
    const mockIdiomaticAsync = vi.fn(async () => 'test');
    const testIdiomaticAsync: TestIdiomaticAsync =
      createIdiomaticAsync(mockIdiomaticAsync);
    const result = await testIdiomaticAsync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    type TestIdiomaticAsync = DefineIdiomaticAsync<
      (args: { name: string }) => Promise<string>
    >;
    const mockIdiomaticAsync = vi.fn(
      async (args: { name: string }) => `Hello ${args.name}`,
    );
    const testIdiomaticAsync: TestIdiomaticAsync =
      createIdiomaticAsync(mockIdiomaticAsync);
    const result = await testIdiomaticAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
