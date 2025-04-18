/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticSync } from './createIdiomaticSync';

describe('createIdiomaticSync', () => {
  it('should create an idiomatic sync function', () => {
    const mockSyncFn = vi.fn(() => 'test');
    const idiomaticSync = createIdiomaticSync(mockSyncFn);

    expect(typeof idiomaticSync).toBe('function');
    expect(idiomaticSync).toBe(mockSyncFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticSync(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic sync');
  });

  it('should invoke the idiomatic function without params', () => {
    const mockSyncFn = vi.fn(() => 'test');
    const idiomaticSync = createIdiomaticSync(mockSyncFn);

    expect(idiomaticSync()).toBe('test');
    expect(mockSyncFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', () => {
    const mockSyncFn = vi.fn(
      (params: { name: string }) => `Hello ${params.name}`,
    );
    const idiomaticSync = createIdiomaticSync(mockSyncFn);

    expect(idiomaticSync({ name: 'John' })).toBe('Hello John');
    expect(mockSyncFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
