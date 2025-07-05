import {
  ChimericMutationWithoutParamsReturnsString,
  ChimericMutationWithParamsReturnsString,
  makeIdiomaticMutationWithoutParamsReturnsString,
  makeIdiomaticMutationWithParamsReturnsString,
  makeReactiveMutationWithoutParamsReturnsString,
  makeReactiveMutationWithParamsReturnsString,
} from '../__tests__/mutationFixtures';
import { fuseChimericMutation } from './fuseChimericMutation';

describe('fuseChimericMutation', () => {
  it('should invoke the idiomatic async function', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithoutParamsReturnsString(),
      reactive: makeReactiveMutationWithoutParamsReturnsString(),
    });
    const result = await testChimericMutation();
    expect(result).toEqual('test');
    expect(testChimericMutation).toHaveBeenCalled();
    expect(testChimericMutation.useMutation).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
      reactive: makeReactiveMutationWithParamsReturnsString(),
    });
    const result = await testChimericMutation({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(testChimericMutation).toHaveBeenCalledWith({ name: 'John' });
    expect(testChimericMutation.useMutation).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithoutParamsReturnsString(),
      reactive: makeReactiveMutationWithoutParamsReturnsString(),
    });
    const result = testChimericMutation.useMutation();
    expect(result.data).toEqual('test');
    expect(testChimericMutation).not.toHaveBeenCalled();
    expect(testChimericMutation.useMutation).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
      reactive: makeReactiveMutationWithParamsReturnsString(),
    });
    const result = testChimericMutation.useMutation();
    expect(result.data).toEqual('Hello John');
    expect(testChimericMutation).not.toHaveBeenCalled();
    expect(testChimericMutation.useMutation).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
      reactive: makeReactiveMutationWithParamsReturnsString(),
    });
    const result = testChimericMutation.useMutation();
    await result.invoke({ name: 'John' });
    expect(testChimericMutation).not.toHaveBeenCalled();
    expect(testChimericMutation.useMutation).toHaveBeenCalled();
    expect(result.invoke).toHaveBeenCalledWith({
      name: 'John',
    });
  });

  it('should handle type annotations without params', async () => {
    const testChimericMutation: ChimericMutationWithoutParamsReturnsString =
      fuseChimericMutation({
        idiomatic: makeIdiomaticMutationWithoutParamsReturnsString(),
        reactive: makeReactiveMutationWithoutParamsReturnsString(),
      });
    await expect(testChimericMutation()).resolves.toEqual('test');
    expect(testChimericMutation.useMutation().data).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const testChimericMutation: ChimericMutationWithParamsReturnsString =
      fuseChimericMutation({
        idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
        reactive: makeReactiveMutationWithParamsReturnsString(),
      });
    await expect(testChimericMutation({ name: 'John' })).resolves.toEqual(
      'Hello John',
    );
    expect(testChimericMutation.useMutation().data).toEqual('Hello John');
  });
});
