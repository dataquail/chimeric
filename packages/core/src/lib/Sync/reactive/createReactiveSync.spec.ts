/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveSync } from './createReactiveSync';
import { DefineReactiveSync } from './types';
import {
  makeSyncFnWithOptionalParamsReturnsString,
  makeSyncFnWithoutParamsReturnsString,
} from '../../__tests__/functionFixtures';

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

  it('should allow no params', () => {
    const mockFn = makeSyncFnWithoutParamsReturnsString();
    const reactiveSync = createReactiveSync(mockFn);

    expect(reactiveSync.use()).toBe('test');

    try {
      // @ts-expect-error
      reactiveSync.use('test');
    } catch (e) {
      // Expected error
    }
  });

  it('should allow type annotations with no params', () => {
    type TestReactiveSync = DefineReactiveSync<() => string>;
    const reactiveSync: TestReactiveSync = createReactiveSync(() => 'test');

    expect(reactiveSync.use()).toBe('test');

    try {
      // @ts-expect-error
      reactiveSync.use('test');
    } catch (e) {
      // Expected error
    }
  });

  it('should allow params', () => {
    const reactiveSync = createReactiveSync(
      (params: { name: string }) => `Hello ${params.name}`,
    );
    expect(reactiveSync.use({ name: 'test' })).toBe('Hello test');

    try {
      // @ts-expect-error
      reactiveSync.use();
    } catch (e) {
      // Expected error
    }
  });

  it('should allow type annotations with params', () => {
    type TestReactiveSync = DefineReactiveSync<(args: { a: string }) => string>;
    const reactiveSync: TestReactiveSync = createReactiveSync(({ a }) => a);

    expect(reactiveSync.use({ a: 'test' })).toBe('test');

    try {
      // @ts-expect-error
      reactiveSync.use();
    } catch (e) {
      // Expected error
    }
  });

  it('should allow type annotations with optional params', () => {
    type TestReactiveSync = DefineReactiveSync<
      (params?: { name: string }) => string
    >;
    const mockFn = makeSyncFnWithOptionalParamsReturnsString();
    const reactiveSync: TestReactiveSync = createReactiveSync(mockFn);

    expect(reactiveSync.use()).toBe('Hello');
    expect(reactiveSync.use({ name: 'test' })).toBe('Hello test');

    try {
      // @ts-expect-error
      reactiveSync.use({ name: 1 });
    } catch (e) {
      // Expected error
    }
  });

  it('should accept optional params', () => {
    const mockFn = makeSyncFnWithOptionalParamsReturnsString();
    const reactiveSync = createReactiveSync(mockFn);

    expect(reactiveSync.use()).toBe('Hello');
    expect(reactiveSync.use({ name: 'test' })).toBe('Hello test');

    try {
      // @ts-expect-error
      reactiveSync.use({ name: 1 });
    } catch (e) {
      // Expected error
    }
  });
});
