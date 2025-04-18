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

  it('should invoke the idiomatic mutation function without params', async () => {
    const mockMutationFn = vi.fn(async () => 'test');
    const idiomaticMutation = createIdiomaticMutation(mockMutationFn);

    const result = await idiomaticMutation();

    expect(result).toBe('test');
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic mutation function with params', async () => {
    const mockMutationFn = vi.fn(
      async (params: { name: string }) => `Hello ${params.name}`,
    );
    const idiomaticMutation = createIdiomaticMutation(mockMutationFn);

    const result = await idiomaticMutation({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockMutationFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
