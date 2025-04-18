/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveSync } from './createReactiveSync';
import { DefineReactiveSync } from './types';

describe('createReactiveSync', () => {
  it('should create a reactive sync function', () => {
    const mockReactiveFn = vi.fn(() => 'test');

    const reactiveSync = createReactiveSync(mockReactiveFn);

    expect(typeof reactiveSync).toBe('object');
    expect(reactiveSync).toHaveProperty('useSync');
    expect(typeof reactiveSync.useSync).toBe('function');
    expect(reactiveSync.useSync).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveSync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive sync');
  });

  it('should allow type annotations with no params', () => {
    type TestReactiveSync = DefineReactiveSync<() => string>;
    const reactiveSync: TestReactiveSync = createReactiveSync(() => 'test');

    expect(reactiveSync.useSync()).toBe('test');
  });

  it('should allow type annotations with params', () => {
    type TestReactiveSync = DefineReactiveSync<(args: { a: string }) => string>;
    const reactiveSync: TestReactiveSync = createReactiveSync(({ a }) => a);

    expect(reactiveSync.useSync({ a: 'test' })).toBe('test');
  });
});
