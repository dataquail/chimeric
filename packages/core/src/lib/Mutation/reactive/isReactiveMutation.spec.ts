/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationTestFixtures } from '../__tests__/mutationFixtures';
import { isReactiveMutation } from './isReactiveMutation';

describe('isReactiveMutation', () => {
  it('should return true for an object with use function', () => {
    const mockReactiveMutation =
      MutationTestFixtures.withoutParams.getReactive().reactiveMutation;
    expect(isReactiveMutation(mockReactiveMutation)).toBe(true);
  });

  it('should return false for invalid inputs', () => {
    expect(isReactiveMutation('not an object' as any)).toBe(false);
    expect(isReactiveMutation(123 as any)).toBe(false);
    expect(isReactiveMutation(null as any)).toBe(false);
    expect(isReactiveMutation(undefined as any)).toBe(false);
    expect(isReactiveMutation({} as any)).toBe(false);
    expect(isReactiveMutation({ notUse: 'something' } as any)).toBe(false);
    expect(isReactiveMutation({ use: 'not a function' } as any)).toBe(false);
  });
});
