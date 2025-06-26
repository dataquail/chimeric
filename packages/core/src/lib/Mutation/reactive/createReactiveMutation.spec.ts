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
    expect(reactiveMutation).toHaveProperty('useMutation');
    expect(typeof reactiveMutation.useMutation).toBe('function');
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
    const hookResult = reactiveMutation.useMutation();
    const result = await hookResult.call();
    expect(result).toBe('test');
    expect(reactiveMutation.useMutation).toHaveBeenCalled();
    expect(hookResult.call).toHaveBeenCalled();
  });

  it('should invoke the reactive mutation function with params', async () => {
    const reactiveMutation = createReactiveMutation(
      makeMutationHookWithParamsReturnsString(),
    );
    const hookResult = reactiveMutation.useMutation();
    const result = await hookResult.call({ name: 'John' });
    expect(result).toBe('Hello John');
    expect(reactiveMutation.useMutation).toHaveBeenCalled();
    expect(hookResult.call).toHaveBeenCalledWith({ name: 'John' });
  });
});
