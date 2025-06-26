import { makeIdiomaticMutationWithoutParamsReturnsString } from '../__tests__/mutationFixtures';
import { isIdiomaticMutation } from './isIdiomaticMutation';

describe('isIdiomaticMutation', () => {
  it('should return true for a function', () => {
    const testIdiomaticMutation =
      makeIdiomaticMutationWithoutParamsReturnsString();
    expect(isIdiomaticMutation(testIdiomaticMutation)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticMutation('not a function')).toBe(false);
    expect(isIdiomaticMutation(123)).toBe(false);
    expect(isIdiomaticMutation({})).toBe(false);
    expect(isIdiomaticMutation(null)).toBe(false);
    expect(isIdiomaticMutation(undefined)).toBe(false);
  });
});
