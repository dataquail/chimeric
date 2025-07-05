/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeMutationHookWithoutParamsReturnsString,
  makeMutationHookWithParamsReturnsString,
} from '../__tests__/mutationFixtures';
import { createReactiveMutation } from './createReactiveMutation';

describe('createReactiveMutation', () => {
  it('should create a reactive mutation function', () => {
    const reactiveMutation = createReactiveMutation(
      makeMutationHookWithoutParamsReturnsString(),
    );

    expect(typeof reactiveMutation).toBe('object');
    expect(reactiveMutation).toHaveProperty('use');
    expect(typeof reactiveMutation.use).toBe('function');
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createReactiveMutation(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive mutation');
  });

  it('should invoke the reactive mutation function without params', async () => {
    const reactiveMutation = createReactiveMutation(
      makeMutationHookWithoutParamsReturnsString(),
    );
    const hookResult = reactiveMutation.use();
    const result = await hookResult.invoke();
    expect(result).toBe('test');
    expect(reactiveMutation.use).toHaveBeenCalled();
    expect(hookResult.invoke).toHaveBeenCalled();
  });

  it('should invoke the reactive mutation function with params', async () => {
    const reactiveMutation = createReactiveMutation(
      makeMutationHookWithParamsReturnsString(),
    );
    const hookResult = reactiveMutation.use();
    const result = await hookResult.invoke({ name: 'John' });
    expect(result).toBe('Hello John');
    expect(reactiveMutation.use).toHaveBeenCalled();
    expect(hookResult.invoke).toHaveBeenCalledWith({ name: 'John' });
  });
});
