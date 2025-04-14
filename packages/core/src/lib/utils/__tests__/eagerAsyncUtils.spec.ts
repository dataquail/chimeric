/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fuseChimericEagerAsync,
  createReactiveEagerAsync,
  isReactiveEagerAsync,
  isChimericEagerAsync,
} from '../EagerAsync';
import { IdiomaticAsync } from '../../types/Async';

describe('fuseChimericEagerAsync', () => {
  it('should fuse idiomatic and reactive eager async functions', () => {
    const mockIdiomaticAsync = vi.fn(async () => 'test') as IdiomaticAsync<
      void,
      string
    >;
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };

    const chimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveEagerAsync,
    });

    expect(typeof chimericEagerAsync).toBe('function');
    expect(chimericEagerAsync).toBe(mockIdiomaticAsync);
    expect(chimericEagerAsync.useEagerAsync).toBe(
      mockReactiveEagerAsync.useEagerAsync,
    );
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticAsync = vi.fn(async () => 'test') as IdiomaticAsync<
      void,
      string
    >;
    const invalidReactive = {
      notUseEagerAsync: vi.fn(),
    };

    expect(() => {
      fuseChimericEagerAsync({
        idiomatic: mockIdiomaticAsync,
        reactive: invalidReactive as any,
      });
    }).toThrow('chimericFn is not qualified to be chimeric eager async');
  });
});

describe('createReactiveEagerAsync', () => {
  it('should create a reactive eager async function', () => {
    const mockReactiveFn = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveEagerAsync = createReactiveEagerAsync(mockReactiveFn);

    expect(typeof reactiveEagerAsync).toBe('object');
    expect(reactiveEagerAsync).toHaveProperty('useEagerAsync');
    expect(typeof reactiveEagerAsync.useEagerAsync).toBe('function');
    expect(reactiveEagerAsync.useEagerAsync).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveEagerAsync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive eager async');
  });
});

describe('isReactiveEagerAsync', () => {
  it('should return true for an object with useEagerAsync function', () => {
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(true);
  });

  it('should return true for a function with useEagerAsync property', () => {
    const mockReactiveEagerAsync = vi.fn(() => 'test') as any;
    mockReactiveEagerAsync.useEagerAsync = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isReactiveEagerAsync(mockReactiveEagerAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveEagerAsync('not an object')).toBe(false);
    expect(isReactiveEagerAsync(123)).toBe(false);
    expect(isReactiveEagerAsync(null)).toBe(false);
    expect(isReactiveEagerAsync(undefined)).toBe(false);
    expect(isReactiveEagerAsync({})).toBe(false);
    expect(isReactiveEagerAsync({ notUseEagerAsync: 'something' })).toBe(false);
    expect(isReactiveEagerAsync({ useEagerAsync: 'not a function' })).toBe(
      false,
    );
  });
});

describe('isChimericEagerAsync', () => {
  it('should return true for a chimeric eager async function', () => {
    const mockChimericEagerAsync = vi.fn(async () => 'test') as any;
    mockChimericEagerAsync.useEagerAsync = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isChimericEagerAsync(mockChimericEagerAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericEagerAsync('not a function')).toBe(false);

    // Function without useEagerAsync
    const mockAsyncFn = vi.fn(async () => 'test');
    expect(isChimericEagerAsync(mockAsyncFn)).toBe(false);

    // Object with useEagerAsync but not a function
    const mockReactiveEagerAsync = {
      useEagerAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
    expect(isChimericEagerAsync(mockReactiveEagerAsync)).toBe(false);

    // Other invalid inputs
    expect(isChimericEagerAsync(123)).toBe(false);
    expect(isChimericEagerAsync(null)).toBe(false);
    expect(isChimericEagerAsync(undefined)).toBe(false);
    expect(isChimericEagerAsync({})).toBe(false);
  });
});
