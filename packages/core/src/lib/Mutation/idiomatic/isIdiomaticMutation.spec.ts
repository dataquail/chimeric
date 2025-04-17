import { isIdiomaticMutation } from './isIdiomaticMutation';

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
