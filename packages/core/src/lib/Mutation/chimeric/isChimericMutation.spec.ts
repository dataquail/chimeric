import {
  makeIdiomaticMutationWithoutParamsReturnsString,
  makeReactiveMutationWithoutParamsReturnsString,
} from '../__tests__/mutationFixtures';
import { fuseChimericMutation } from './fuseChimericMutation';
import { isChimericMutation } from './isChimericMutation';

describe('isChimericMutation', () => {
  it('should return true for a chimeric mutation function', () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithoutParamsReturnsString(),
      reactive: makeReactiveMutationWithoutParamsReturnsString(),
    });

    expect(isChimericMutation(testChimericMutation)).toBe(true);
  });

  it('should return false for non-chimeric inputs', () => {
    // Not a function
    expect(isChimericMutation('not a function')).toBe(false);

    // Function without use
    const mockMutationFn = makeIdiomaticMutationWithoutParamsReturnsString();
    expect(isChimericMutation(mockMutationFn)).toBe(false);

    // Object with use but not a function
    const mockReactiveMutation =
      makeReactiveMutationWithoutParamsReturnsString();
    expect(isChimericMutation(mockReactiveMutation)).toBe(false);

    // Other invalid inputs
    expect(isChimericMutation(123)).toBe(false);
    expect(isChimericMutation(null)).toBe(false);
    expect(isChimericMutation(undefined)).toBe(false);
    expect(isChimericMutation({})).toBe(false);
  });
});
