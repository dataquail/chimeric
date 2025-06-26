/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticMutation } from './createIdiomaticMutation';
import { makeAsyncFnWithoutParamsReturnsString } from '../../__tests__/functionFixtures';
import {
  makeMutationFnWithoutParamsReturnsString,
  makeMutationFnWithParamsReturnsObj,
  makeMutationFnWithParamsReturnsString,
} from '../__tests__/mutationFixtures';

describe('createIdiomaticMutation', () => {
  it('should create an idiomatic mutation function', () => {
    const asyncFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticMutation = createIdiomaticMutation(asyncFn);
    expect(typeof idiomaticMutation).toBe('function');
    expect(idiomaticMutation).toBe(asyncFn);
  });

  it('should throw an error for invalid input', () => {
    const invalidInput = 'not a function';
    expect(() => {
      createIdiomaticMutation(invalidInput as any);
    }).toThrow('idiomaticFn is not qualified to be idiomatic mutation');
  });

  it('should invoke the idiomatic mutation function without params', async () => {
    const idiomaticMutation = createIdiomaticMutation(
      makeMutationFnWithoutParamsReturnsString(),
    );
    const result = await idiomaticMutation();
    expect(result).toBe('test');
    expect(idiomaticMutation).toHaveBeenCalled();
  });

  it('should invoke the idiomatic mutation function with params', async () => {
    const idiomaticMutation = createIdiomaticMutation(
      makeMutationFnWithParamsReturnsString(),
    );
    const result = await idiomaticMutation({ name: 'John' });
    expect(result).toBe('Hello John');
    expect(idiomaticMutation).toHaveBeenCalledWith({
      name: 'John',
    });
  });

  it('should should return the correct type', async () => {
    const idiomaticMutation = createIdiomaticMutation(
      makeMutationFnWithParamsReturnsObj(),
    );
    const result = await idiomaticMutation({ name: 'John' });
    expect(result.name).toBe('John');
  });
});
