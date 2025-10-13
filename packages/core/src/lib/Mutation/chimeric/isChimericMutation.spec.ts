/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationTestFixtures } from '../__tests__/mutationFixtures';
import { fuseChimericMutation } from './fuseChimericMutation';
import { isChimericMutation } from './isChimericMutation';

describe('isChimericMutation', () => {
  it('should return true for a chimeric mutation function', () => {
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withoutParams.getChimeric();
    const testChimericMutation = fuseChimericMutation({
      idiomatic: idiomaticMutation,
      reactive: reactiveMutation,
    });

    expect(isChimericMutation(testChimericMutation)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    const { idiomaticMutation, reactiveMutation } =
      MutationTestFixtures.withoutParams.getChimeric();
    // Not a function
    expect(isChimericMutation('not a function' as any)).toBe(false);

    // Function without use
    expect(isChimericMutation(idiomaticMutation as any)).toBe(false);

    // Object with use but not a function
    expect(isChimericMutation(reactiveMutation as any)).toBe(false);

    // Other invalid inputs
    expect(isChimericMutation(123 as any)).toBe(false);
    expect(isChimericMutation(null as any)).toBe(false);
    expect(isChimericMutation(undefined as any)).toBe(false);
    expect(isChimericMutation({} as any)).toBe(false);
  });
});
