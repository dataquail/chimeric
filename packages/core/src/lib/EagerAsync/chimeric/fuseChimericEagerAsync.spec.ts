import { EagerAsyncTestFixtures } from '../__tests__/eagerAsyncFixtures';
import { fuseChimericEagerAsync } from './fuseChimericEagerAsync';

describe('fuseChimericEagerAsync', () => {
  it('should invoke the idiomatic async function', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    const result = await testChimericEagerAsync();
    expect(result).toEqual('test');
    expect(idiomaticEagerAsync).toHaveBeenCalled();
    expect(reactiveEagerAsync.use).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getChimeric();

    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    const result = await testChimericEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(idiomaticEagerAsync).toHaveBeenCalledWith({ name: 'John' });
    expect(reactiveEagerAsync.use).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    const result = testChimericEagerAsync.use();
    expect(result.data).toEqual('test');
    expect(idiomaticEagerAsync).not.toHaveBeenCalled();
    expect(reactiveEagerAsync.use).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync } =
      EagerAsyncTestFixtures.withParams.getChimeric();

    const testChimericEagerAsync = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    const result = testChimericEagerAsync.use({ name: 'John' });
    expect(result.data).toEqual('Hello John');
    expect(idiomaticEagerAsync).not.toHaveBeenCalled();
    expect(reactiveEagerAsync.use).toHaveBeenCalledWith({
      name: 'John',
    });
  });

  it('should handle type annotations with no params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withoutParams.getChimeric();

    type TestAnnotation = typeof _annotation;
    const testChimericEagerAsync: TestAnnotation = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    const result = await testChimericEagerAsync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', async () => {
    const { idiomaticEagerAsync, reactiveEagerAsync, annotation: _annotation } =
      EagerAsyncTestFixtures.withParams.getChimeric();

    type TestAnnotation = typeof _annotation;
    const testChimericEagerAsync: TestAnnotation = fuseChimericEagerAsync({
      idiomatic: idiomaticEagerAsync,
      reactive: reactiveEagerAsync,
    });
    const result = await testChimericEagerAsync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
