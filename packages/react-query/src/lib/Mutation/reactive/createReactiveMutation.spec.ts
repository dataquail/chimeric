/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeMutationHookWithoutParamsReturnsString,
  makeMutationHookWithParamsReturnsString,
  ReactiveMutationWithoutParamsReturnsString,
  ReactiveMutationWithParamsReturnsString,
} from '../__tests__/mutationFixtures';
import { createReactiveMutation } from './createReactiveMutation';

describe('createReactiveMutation', () => {
  it('should create a reactive mutation function', () => {
    const mockReactiveFn = makeMutationHookWithoutParamsReturnsString();
    const reactiveMutation = createReactiveMutation(mockReactiveFn);

    expect(typeof reactiveMutation).toBe('object');
    expect(reactiveMutation).toHaveProperty('useMutation');
    expect(typeof reactiveMutation.useMutation).toBe('function');
    expect(reactiveMutation.useMutation).toBe(mockReactiveFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';

    expect(() => {
      createReactiveMutation(invalidInput as any);
    }).toThrow('reactiveFn is not qualified to be reactive mutation');
  });

  it('should invoke the reactive mutation function without params', async () => {
    const mockReactiveFn = makeMutationHookWithoutParamsReturnsString();

    const reactiveMutation = createReactiveMutation(mockReactiveFn);

    const hookResult = reactiveMutation.useMutation();
    const result = await hookResult.call();

    expect(result).toBe('test');
    expect(hookResult.call).toHaveBeenCalled();
    expect(mockReactiveFn).toHaveBeenCalled();
  });

  it('should invoke the reactive mutation function with params', async () => {
    const mockReactiveFn = makeMutationHookWithParamsReturnsString();
    const reactiveMutation = createReactiveMutation(mockReactiveFn);

    const hookResult = reactiveMutation.useMutation();
    const result = await hookResult.call({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(hookResult.call).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should pass options and nativeOptions to the useMutation function', () => {
    const mockReactiveFn = makeMutationHookWithoutParamsReturnsString();
    const reactiveMutation = createReactiveMutation(mockReactiveFn);

    const options = {};
    const nativeOptions = { retry: 3 };

    reactiveMutation.useMutation({ options, nativeOptions });

    expect(mockReactiveFn).toHaveBeenCalledWith({
      options,
      nativeOptions,
    });
  });

  it('should handle type annotations without params', async () => {
    const mockReactiveFn = makeMutationHookWithoutParamsReturnsString();
    const reactiveMutation: ReactiveMutationWithoutParamsReturnsString =
      createReactiveMutation(mockReactiveFn);

    const result = await reactiveMutation.useMutation().call();

    expect(result).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    const mockReactiveFn = makeMutationHookWithParamsReturnsString();
    const reactiveMutation: ReactiveMutationWithParamsReturnsString =
      createReactiveMutation(mockReactiveFn);

    const result = await reactiveMutation.useMutation().call({ name: 'John' });

    expect(result).toBe('Hello John');
  });
});
