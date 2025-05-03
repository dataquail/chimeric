/* eslint-disable @typescript-eslint/no-explicit-any */
import { isReactiveMutation } from './isReactiveMutation';
import { UseMutationResult } from '@tanstack/react-query';

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
        native: {} as UseMutationResult<string, Error, undefined>,
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
      native: {} as UseMutationResult<string, Error, undefined>,
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
