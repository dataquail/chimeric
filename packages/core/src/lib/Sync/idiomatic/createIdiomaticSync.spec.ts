/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeSyncFnWithOptionalParamsReturnsString,
  makeSyncFnWithoutParamsReturnsString,
  makeSyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { createIdiomaticSync } from './createIdiomaticSync';
import { DefineIdiomaticSync } from './types';

describe('createIdiomaticSync', () => {
  it('should create an idiomatic sync function', () => {
    const mockSyncFn = makeSyncFnWithoutParamsReturnsString();
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
    const mockSyncFn = makeSyncFnWithoutParamsReturnsString();
    const idiomaticSync = createIdiomaticSync(mockSyncFn);

    expect(idiomaticSync()).toBe('test');
    expect(mockSyncFn).toHaveBeenCalled();

    try {
      // @ts-expect-error - no params expected
      idiomaticSync('test');
    } catch {
      // Expected error
    }
  });

  it('should invoke the idiomatic function with params', () => {
    const mockSyncFn = makeSyncFnWithParamsReturnsString();
    const idiomaticSync = createIdiomaticSync(mockSyncFn);

    expect(idiomaticSync({ name: 'John' })).toBe('Hello John');
    expect(mockSyncFn).toHaveBeenCalledWith({ name: 'John' });

    try {
      // @ts-expect-error - missing params
      idiomaticSync();
    } catch {
      // Expected error
    }
  });

  it('should invoke the idiomatic function with optional params', () => {
    const mockSyncFn = makeSyncFnWithOptionalParamsReturnsString();
    const idiomaticSync = createIdiomaticSync(mockSyncFn);

    expect(idiomaticSync()).toBe('Hello');
    expect(mockSyncFn).toHaveBeenCalledWith();

    expect(idiomaticSync({ name: 'John' })).toBe('Hello John');
    expect(mockSyncFn).toHaveBeenCalledWith({ name: 'John' });

    try {
      // @ts-expect-error - wrong param type
      idiomaticSync({ name: 1 });
    } catch {
      // Expected error
    }
  });

  it('should handle type annotations without params', () => {
    type TestIdiomaticSync = DefineIdiomaticSync<() => string>;
    const idiomaticSync: TestIdiomaticSync = createIdiomaticSync(() => 'test');
    expect(idiomaticSync()).toBe('test');
    try {
      // @ts-expect-error - no params expected
      idiomaticSync('test');
    } catch {
      // Expected error
    }
  });

  it('should handle type annotations with params', () => {
    type TestIdiomaticSync = DefineIdiomaticSync<
      (args: { a: string }) => string
    >;
    const idiomaticSync: TestIdiomaticSync = createIdiomaticSync(({ a }) => a);
    expect(idiomaticSync({ a: 'test' })).toBe('test');
    try {
      // @ts-expect-error - missing params
      idiomaticSync();
    } catch {
      // Expected error
    }
  });

  it('should handle type annotations with optional params', () => {
    type TestIdiomaticSync = DefineIdiomaticSync<
      (params?: { name: string }) => string
    >;
    const mockFn = makeSyncFnWithOptionalParamsReturnsString();
    const idiomaticSync: TestIdiomaticSync = createIdiomaticSync(mockFn);

    expect(idiomaticSync()).toBe('Hello');
    expect(idiomaticSync({ name: 'test' })).toBe('Hello test');

    try {
      // @ts-expect-error - wrong param type
      idiomaticSync({ name: 1 });
    } catch {
      // Expected error
    }
  });
});
