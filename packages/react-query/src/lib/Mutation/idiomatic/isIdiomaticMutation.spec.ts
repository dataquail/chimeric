/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationTestFixtures } from '../__tests__/mutationFixtures';
import { isIdiomaticMutation } from './isIdiomaticMutation';

describe('isIdiomaticMutation', () => {
  it('should return true for a function', () => {
    const { idiomaticMutation } =
      MutationTestFixtures.withoutParams.getIdiomatic();

    expect(isIdiomaticMutation(idiomaticMutation)).toBe(true);
  });

  it('should return false for non-function values', () => {
    expect(isIdiomaticMutation('not a function' as any)).toBe(false);
    expect(isIdiomaticMutation(123 as any)).toBe(false);
    expect(isIdiomaticMutation({} as any)).toBe(false);
    expect(isIdiomaticMutation(null as any)).toBe(false);
    expect(isIdiomaticMutation(undefined as any)).toBe(false);
  });
});
