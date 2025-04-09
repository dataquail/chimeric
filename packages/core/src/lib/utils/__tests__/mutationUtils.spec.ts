/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fuseChimericMutation,
  createIdiomaticMutation,
  createReactiveMutation,
  isIdiomaticMutation,
  isReactiveMutation,
  isChimericMutation,
} from '../Mutation';
import { IdiomaticMutation } from '../../types/Mutation';

describe('fuseChimericMutation', () => {
  it('should fuse idiomatic and reactive mutation functions', () => {
    const mockIdiomaticMutation = vi.fn(
      async () => 'test',
    ) as IdiomaticMutation<void, string>;
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
      })),
    };

    const chimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });

    expect(typeof chimericMutation).toBe('function');
    expect(chimericMutation).toBe(mockIdiomaticMutation);
    expect(chimericMutation.useMutation).toBe(mockReactiveMutation.useMutation);
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticMutation = vi.fn(
      async () => 'test',
    ) as IdiomaticMutation<void, string>;
    const invalidReactive = {
      notUseMutation: vi.fn(),
    };

    expect(() => {
      fuseChimericMutation({
        idiomatic: mockIdiomaticMutation,
        reactive: invalidReactive as any,
      });
    }).toThrow('chimericFn is not qualified to be chimeric mutation');
  });
});

describe('createIdiomaticMutation', () => {
  it('should create an idiomatic mutation function', () => {
    const mockMutationFn = vi.fn(async () => 'test');
    const idiomaticMutation = createIdiomaticMutation(mockMutationFn);

    expect(typeof idiomaticMutation).toBe('function');
    expect(idiomaticMutation).toBe(mockMutationFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticMutation(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic mutation');
  });
});

describe('createReactiveMutation', () => {
  it('should create a reactive mutation function', () => {
    const mockReactiveFn = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: vi.fn(),
    }));

    const reactiveMutation = createReactiveMutation(mockReactiveFn);

    expect(typeof reactiveMutation).toBe('object');
    expect(reactiveMutation).toHaveProperty('useMutation');
    expect(typeof reactiveMutation.useMutation).toBe('function');
    expect(reactiveMutation.useMutation).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveMutation(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive mutation');
  });
});

describe('isIdiomaticMutation', () => {
  it('should return true for a function', () => {
    const mockMutationFn = vi.fn(async () => 'test');

    expect(isIdiomaticMutation(mockMutationFn)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticMutation('not a function')).toBe(false);
    expect(isIdiomaticMutation(123)).toBe(false);
    expect(isIdiomaticMutation({})).toBe(false);
    expect(isIdiomaticMutation(null)).toBe(false);
    expect(isIdiomaticMutation(undefined)).toBe(false);
  });
});

describe('isReactiveMutation', () => {
  it('should return true for an object with useMutation function', () => {
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
      })),
    };

    expect(isReactiveMutation(mockReactiveMutation)).toBe(true);
  });

  it('should return true for a function with useMutation property', () => {
    const mockReactiveMutation = vi.fn(() => 'test') as any;
    mockReactiveMutation.useMutation = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: vi.fn(),
    }));

    expect(isReactiveMutation(mockReactiveMutation)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveMutation('not an object')).toBe(false);
    expect(isReactiveMutation(123)).toBe(false);
    expect(isReactiveMutation(null)).toBe(false);
    expect(isReactiveMutation(undefined)).toBe(false);
    expect(isReactiveMutation({})).toBe(false);
    expect(isReactiveMutation({ notUseMutation: 'something' })).toBe(false);
    expect(isReactiveMutation({ useMutation: 'not a function' })).toBe(false);
  });
});

describe('isChimericMutation', () => {
  it('should return true for a chimeric mutation function', () => {
    const mockChimericMutation = vi.fn(async () => 'test') as any;
    mockChimericMutation.useMutation = vi.fn(() => ({
      call: vi.fn(() => Promise.resolve('test')),
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: undefined,
      reset: vi.fn(),
    }));

    expect(isChimericMutation(mockChimericMutation)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericMutation('not a function')).toBe(false);

    // Function without useMutation
    const mockMutationFn = vi.fn(async () => 'test');
    expect(isChimericMutation(mockMutationFn)).toBe(false);

    // Object with useMutation but not a function
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
      })),
    };
    expect(isChimericMutation(mockReactiveMutation)).toBe(false);

    // Other invalid inputs
    expect(isChimericMutation(123)).toBe(false);
    expect(isChimericMutation(null)).toBe(false);
    expect(isChimericMutation(undefined)).toBe(false);
    expect(isChimericMutation({})).toBe(false);
  });
});
