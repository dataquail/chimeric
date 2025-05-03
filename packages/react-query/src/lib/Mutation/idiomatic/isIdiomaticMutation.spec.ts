import { isIdiomaticMutation } from './isIdiomaticMutation';
import { MutationOptions } from '@tanstack/react-query';

describe('isIdiomaticMutation', () => {
  it('should return true for a function', () => {
    const mockMutationFn = vi.fn(async () => 'test');

    expect(isIdiomaticMutation(mockMutationFn)).toBe(true);
  });

  it('should return true for a function that accepts options', () => {
    const mockMutationFn = vi.fn(
      async (_params: {
        options?: never;
        nativeOptions?: Omit<
          MutationOptions<string, Error, undefined>,
          'mutationFn'
        >;
      }) => 'test',
    );

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
