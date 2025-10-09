/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeSyncFnWithOptionalParamsReturnsString,
  makeSyncFnWithoutParamsReturnsString,
  makeSyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import { createIdiomaticSync } from '../idiomatic/createIdiomaticSync';
import { createReactiveSync } from '../reactive/createReactiveSync';
import { fuseChimericSync } from './fuseChimericSync';

describe('fuseChimericSync', () => {
  it('should create a chimeric sync function', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const chimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticSync,
      reactive: mockReactiveSync,
    });

    expect(typeof chimericSync).toBe('function');
    expect(chimericSync).toHaveProperty('use');
    expect(typeof chimericSync.use).toBe('function');
    expect(chimericSync).toBe(mockIdiomaticSync);
    expect(chimericSync.use).toBe(mockReactiveSync.use);
  });

  it('should allow no params', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const testChimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticSync,
      reactive: mockReactiveSync,
    });
    const result = testChimericSync();
    expect(result).toEqual('test');
    expect(mockIdiomaticSync).toHaveBeenCalled();
    expect(mockReactiveSync.use).not.toHaveBeenCalled();

    const reactiveResult = testChimericSync.use();
    expect(reactiveResult).toEqual('test');
    expect(mockReactiveSync.use).toHaveBeenCalled();
    expect(mockIdiomaticSync).toHaveBeenCalledTimes(1);

    try {
      // @ts-expect-error - no params expected
      testChimericSync('test');
    } catch {
      // Expected error
    }

    try {
      // @ts-expect-error - no params expected
      testChimericSync.use('test');
    } catch {
      // Expected error
    }
  });

  it('should allow params', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithParamsReturnsString(),
    );
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithParamsReturnsString(),
    );
    const testChimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticSync,
      reactive: mockReactiveSync,
    });
    const result = testChimericSync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticSync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveSync.use).not.toHaveBeenCalled();

    const reactiveResult = testChimericSync.use({ name: 'John' });
    expect(reactiveResult).toEqual('Hello John');
    expect(mockReactiveSync.use).toHaveBeenCalledWith({ name: 'John' });
    expect(mockIdiomaticSync).toHaveBeenCalledTimes(1);

    try {
      // @ts-expect-error - missing params
      testChimericSync();
    } catch {
      // Expected error
    }

    try {
      // @ts-expect-error - missing params
      testChimericSync.use();
    } catch {
      // Expected error
    }
  });

  it('should allow optional params', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithOptionalParamsReturnsString(),
    );
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithOptionalParamsReturnsString(),
    );
    const testChimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticSync,
      reactive: mockReactiveSync,
    });
    const resultNoArgs = testChimericSync();
    expect(resultNoArgs).toEqual('Hello');
    expect(mockIdiomaticSync).toHaveBeenCalledWith();
    expect(mockReactiveSync.use).not.toHaveBeenCalled();

    const resultWithArgs = testChimericSync({ name: 'John' });
    expect(resultWithArgs).toEqual('Hello John');
    expect(mockIdiomaticSync).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveSync.use).not.toHaveBeenCalled();

    const reactiveResultNoArgs = testChimericSync.use();
    expect(reactiveResultNoArgs).toEqual('Hello');
    expect(mockReactiveSync.use).toHaveBeenCalledWith();
    expect(mockIdiomaticSync).toHaveBeenCalledTimes(2); // once for each previous call

    const reactiveResultWithArgs = testChimericSync.use({ name: 'John' });
    expect(reactiveResultWithArgs).toEqual('Hello John');
    expect(mockReactiveSync.use).toHaveBeenCalledWith({ name: 'John' });
    expect(mockIdiomaticSync).toHaveBeenCalledTimes(2); // once for each previous call

    try {
      // @ts-expect-error - wrong param type
      testChimericSync({ name: 1 });
    } catch {
      // Expected error
    }

    try {
      // @ts-expect-error - wrong param type
      testChimericSync.use({ name: 1 });
    } catch {
      // Expected error
    }
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const invalidReactive = {
      notUse: makeSyncFnWithoutParamsReturnsString(),
    };

    expect(() => {
      fuseChimericSync({
        idiomatic: mockIdiomaticSync,
        reactive: invalidReactive as any,
      });
    }).toThrow('chimericFn is not qualified to be chimeric sync');
  });
});
