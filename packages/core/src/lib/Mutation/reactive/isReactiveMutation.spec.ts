/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeReactiveMutationWithoutParamsReturnsString } from '../__tests__/mutationFixtures';
import { isReactiveMutation } from './isReactiveMutation';

describe('isReactiveMutation', () => {
  it('should return true for an object with useMutation function', () => {
    const mockReactiveMutation =
      makeReactiveMutationWithoutParamsReturnsString();
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
