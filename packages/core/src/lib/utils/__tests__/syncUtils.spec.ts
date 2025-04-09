/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fuseChimericSync,
  createIdiomaticSync,
  createReactiveSync,
  isIdiomaticSync,
  isReactiveSync,
  isChimericSync,
} from '../Sync';
import { IdiomaticSync } from '../../types/Sync';

describe('fuseChimericSync', () => {
  it('should fuse idiomatic and reactive sync functions', () => {
    const mockIdiomaticSync = vi.fn(() => 'test') as IdiomaticSync<
      void,
      string
    >;
    const mockReactiveSync = {
      useSync: vi.fn(() => 'test'),
    };

    const chimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticSync,
      reactive: mockReactiveSync,
    });

    expect(typeof chimericSync).toBe('function');
    expect(chimericSync).toBe(mockIdiomaticSync);
    expect(chimericSync.useSync).toBe(mockReactiveSync.useSync);
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticSync = vi.fn(() => 'test') as IdiomaticSync<
      void,
      string
    >;
    const invalidReactive = {
      notUseSync: vi.fn(),
    };

    expect(() => {
      fuseChimericSync({
        idiomatic: mockIdiomaticSync,
        reactive: invalidReactive as any,
      });
    }).toThrow('chimericFn is not qualified to be chimeric sync');
  });
});

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
});

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
});

describe('isIdiomaticSync', () => {
  it('should return true for a function', () => {
    const mockSyncFn = vi.fn(() => 'test');

    expect(isIdiomaticSync(mockSyncFn)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticSync('not a function')).toBe(false);
    expect(isIdiomaticSync(123)).toBe(false);
    expect(isIdiomaticSync({})).toBe(false);
    expect(isIdiomaticSync(null)).toBe(false);
    expect(isIdiomaticSync(undefined)).toBe(false);
  });
});

describe('isReactiveSync', () => {
  it('should return true for an object with useSync function', () => {
    const mockReactiveSync = {
      useSync: vi.fn(() => 'test'),
    };

    expect(isReactiveSync(mockReactiveSync)).toBe(true);
  });

  it('should return true for a function with useSync property', () => {
    const mockReactiveSync = vi.fn(() => 'test') as any;
    mockReactiveSync.useSync = vi.fn(() => 'test');

    expect(isReactiveSync(mockReactiveSync)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveSync('not an object')).toBe(false);
    expect(isReactiveSync(123)).toBe(false);
    expect(isReactiveSync(null)).toBe(false);
    expect(isReactiveSync(undefined)).toBe(false);
    expect(isReactiveSync({})).toBe(false);
    expect(isReactiveSync({ notUseSync: 'something' })).toBe(false);
    expect(isReactiveSync({ useSync: 'not a function' })).toBe(false);
  });
});

describe('isChimericSync', () => {
  it('should return true for a chimeric sync function', () => {
    const mockChimericSync = vi.fn(() => 'test') as any;
    mockChimericSync.useSync = vi.fn(() => 'test');

    expect(isChimericSync(mockChimericSync)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericSync('not a function')).toBe(false);

    // Function without useSync
    const mockSyncFn = vi.fn(() => 'test');
    expect(isChimericSync(mockSyncFn)).toBe(false);

    // Object with useSync but not a function
    const mockReactiveSync = {
      useSync: vi.fn(() => 'test'),
    };
    expect(isChimericSync(mockReactiveSync)).toBe(false);

    // Other invalid inputs
    expect(isChimericSync(123)).toBe(false);
    expect(isChimericSync(null)).toBe(false);
    expect(isChimericSync(undefined)).toBe(false);
    expect(isChimericSync({})).toBe(false);
  });
});
