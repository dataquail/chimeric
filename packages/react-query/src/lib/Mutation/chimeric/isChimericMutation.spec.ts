/* eslint-disable @typescript-eslint/no-explicit-any */
import { isChimericMutation } from './isChimericMutation';

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
      native: 'test',
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
        native: 'test',
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
