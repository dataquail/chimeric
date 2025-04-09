import {
  createIdiomaticAsync,
  createReactiveAsync,
  isIdiomaticAsync,
  isReactiveAsync,
  isChimericAsync,
} from '../Async';

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
});

describe('createReactiveAsync', () => {
  it('should create a reactive async function', () => {
    const mockReactiveFn = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    const reactiveAsync = createReactiveAsync(mockReactiveFn);

    expect(typeof reactiveAsync).toBe('object');
    expect(reactiveAsync).toHaveProperty('useAsync');
    expect(typeof reactiveAsync.useAsync).toBe('function');
    expect(reactiveAsync.useAsync).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveAsync(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive async');
  });
});

describe('isIdiomaticAsync', () => {
  it('should return true for a function', () => {
    const mockAsyncFn = vi.fn(async () => 'test');

    expect(isIdiomaticAsync(mockAsyncFn)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticAsync('not a function')).toBe(false);
    expect(isIdiomaticAsync(123)).toBe(false);
    expect(isIdiomaticAsync({})).toBe(false);
    expect(isIdiomaticAsync(null)).toBe(false);
    expect(isIdiomaticAsync(undefined)).toBe(false);
  });
});

describe('isReactiveAsync', () => {
  it('should return true for an object with useAsync function', () => {
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

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return true for a function with useAsync property', () => {
    const mockReactiveAsync = vi.fn(() => 'test') as any;
    mockReactiveAsync.useAsync = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isReactiveAsync(mockReactiveAsync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveAsync('not an object')).toBe(false);
    expect(isReactiveAsync(123)).toBe(false);
    expect(isReactiveAsync(null)).toBe(false);
    expect(isReactiveAsync(undefined)).toBe(false);
    expect(isReactiveAsync({})).toBe(false);
    expect(isReactiveAsync({ notUseAsync: 'something' })).toBe(false);
    expect(isReactiveAsync({ useAsync: 'not a function' })).toBe(false);
  });
});

describe('isChimericAsync', () => {
  it('should return true for a chimeric async function', () => {
    const mockChimericAsync = vi.fn(async () => 'test') as any;
    mockChimericAsync.useAsync = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
    }));

    expect(isChimericAsync(mockChimericAsync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericAsync('not a function')).toBe(false);

    // Function without useAsync
    const mockAsyncFn = vi.fn(async () => 'test');
    expect(isChimericAsync(mockAsyncFn)).toBe(false);

    // Object with useAsync but not a function
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
    expect(isChimericAsync(mockReactiveAsync)).toBe(false);

    // Other invalid inputs
    expect(isChimericAsync(123)).toBe(false);
    expect(isChimericAsync(null)).toBe(false);
    expect(isChimericAsync(undefined)).toBe(false);
    expect(isChimericAsync({})).toBe(false);
  });
});
