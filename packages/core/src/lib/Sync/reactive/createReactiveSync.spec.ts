/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveSync } from './createReactiveSync';
import { DefineReactiveSync } from './types';
import { makeSyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';

describe('createReactiveSync', () => {
  it('should create a reactive sync function', () => {
    const mockReactiveFn = makeSyncFnWithoutParamsReturnsString();
    const reactiveSync = createReactiveSync(mockReactiveFn);

    expect(typeof reactiveSync).toBe('object');
    expect(reactiveSync).toHaveProperty('use');
    expect(typeof reactiveSync.use).toBe('function');
    expect(reactiveSync.use).toBe(mockReactiveFn);
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

    expect(reactiveSync.use()).toBe('test');
  });

  it('should allow type annotations with params', () => {
    type TestReactiveSync = DefineReactiveSync<(args: { a: string }) => string>;
    const reactiveSync: TestReactiveSync = createReactiveSync(({ a }) => a);

    expect(reactiveSync.use({ a: 'test' })).toBe('test');
  });
});
