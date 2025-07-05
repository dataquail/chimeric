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
    expect(reactiveMutation).toHaveProperty('use');
    expect(typeof reactiveMutation.use).toBe('function');
    expect(reactiveMutation.use).toBe(mockReactiveFn);
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

    const hookResult = reactiveMutation.use();
    const result = await hookResult.invoke();

    expect(result).toBe('test');
    expect(hookResult.invoke).toHaveBeenCalled();
    expect(mockReactiveFn).toHaveBeenCalled();
  });

  it('should invoke the reactive mutation function with params', async () => {
    const mockReactiveFn = makeMutationHookWithParamsReturnsString();
    const reactiveMutation = createReactiveMutation(mockReactiveFn);

    const hookResult = reactiveMutation.use();
    const result = await hookResult.invoke({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(hookResult.invoke).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should pass options and nativeOptions to the use function', () => {
    const mockReactiveFn = makeMutationHookWithoutParamsReturnsString();
    const reactiveMutation = createReactiveMutation(mockReactiveFn);

    const options = {};
    const nativeOptions = { retry: 3 };

    reactiveMutation.use({ options, nativeOptions });

    expect(mockReactiveFn).toHaveBeenCalledWith({
      options,
      nativeOptions,
    });
  });

  it('should handle type annotations without params', async () => {
    const mockReactiveFn = makeMutationHookWithoutParamsReturnsString();
    const reactiveMutation: ReactiveMutationWithoutParamsReturnsString =
      createReactiveMutation(mockReactiveFn);

    const result = await reactiveMutation.use().invoke();

    expect(result).toBe('test');
  });

  it('should handle type annotations with params', async () => {
    const mockReactiveFn = makeMutationHookWithParamsReturnsString();
    const reactiveMutation: ReactiveMutationWithParamsReturnsString =
      createReactiveMutation(mockReactiveFn);

    const result = await reactiveMutation.use().invoke({ name: 'John' });

    expect(result).toBe('Hello John');
  });
});
