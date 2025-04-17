/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticMutation } from './createIdiomaticMutation';

describe('createIdiomaticMutation', () => {
  it('should create an idiomatic mutation function', () => {
    const mockMutationFn = vi.fn(async () => 'test');
    const idiomaticMutation = createIdiomaticMutation(mockMutationFn);

    expect(typeof idiomaticMutation).toBe('function');
    expect(idiomaticMutation).toBe(mockMutationFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createIdiomaticMutation(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic mutation');
  });
});
