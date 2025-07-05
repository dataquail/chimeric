import { fuseChimericMutation } from './fuseChimericMutation';
import {
  ChimericMutationWithoutParamsReturnsString,
  ChimericMutationWithParamsReturnsString,
  makeIdiomaticMutationWithoutParamsReturnsString,
  makeIdiomaticMutationWithParamsReturnsString,
  makeReactiveMutationWithoutParamsReturnsString,
  makeReactiveMutationWithParamsReturnsString,
} from '../__tests__/mutationFixtures';

describe('fuseChimericMutation', () => {
  it('should invoke the idiomatic async function', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithoutParamsReturnsString(),
      reactive: makeReactiveMutationWithoutParamsReturnsString(),
    });
    const result = await testChimericMutation();
    expect(result).toEqual('test');
    expect(testChimericMutation).toHaveBeenCalled();
    expect(testChimericMutation.use).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
      reactive: makeReactiveMutationWithParamsReturnsString(),
    });
    const result = await testChimericMutation({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(testChimericMutation).toHaveBeenCalledWith({ name: 'John' });
    expect(testChimericMutation.use).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithoutParamsReturnsString(),
      reactive: makeReactiveMutationWithoutParamsReturnsString(),
    });
    const result = testChimericMutation.use();
    expect(result.data).toEqual('test');
    expect(testChimericMutation).not.toHaveBeenCalled();
    expect(testChimericMutation.use).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
      reactive: makeReactiveMutationWithParamsReturnsString(),
    });
    const result = testChimericMutation.use();
    expect(result.data).toEqual('Hello John');
    expect(testChimericMutation).not.toHaveBeenCalled();
    expect(testChimericMutation.use).toHaveBeenCalled();
  });

  it('should invoke the reactive call function', async () => {
    const testChimericMutation = fuseChimericMutation({
      idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
      reactive: makeReactiveMutationWithParamsReturnsString(),
    });
    const result = testChimericMutation.use();
    await result.invoke({ name: 'John' });
    expect(testChimericMutation).not.toHaveBeenCalled();
    expect(testChimericMutation.use).toHaveBeenCalled();
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
    const result = await testChimericMutation();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const testChimericMutation: ChimericMutationWithParamsReturnsString =
      fuseChimericMutation({
        idiomatic: makeIdiomaticMutationWithParamsReturnsString(),
        reactive: makeReactiveMutationWithParamsReturnsString(),
      });
    const result = await testChimericMutation({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
