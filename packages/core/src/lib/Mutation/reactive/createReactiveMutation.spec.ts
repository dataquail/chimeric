/* eslint-disable @typescript-eslint/no-explicit-any */
import { createReactiveMutation } from './createReactiveMutation';

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
