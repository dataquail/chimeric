/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  makeSyncFnWithoutParamsReturnsString,
  makeSyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  ChimericSyncWithoutParamsReturnsString,
  ChimericSyncWithParamsReturnsString,
} from '../../__tests__/syncFixtures';
import { createIdiomaticSync } from '../idiomatic/createIdiomaticSync';
import { createReactiveSync } from '../reactive/createReactiveSync';
import { fuseChimericSync } from './fuseChimericSync';

describe('fuseChimericSync', () => {
  it('should invoke the idiomatic function', () => {
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
    expect(mockReactiveSync.useSync).not.toHaveBeenCalled();
  });

  it('should invoke the idiomatic function with params', () => {
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
    expect(mockReactiveSync.useSync).not.toHaveBeenCalled();
  });

  it('should invoke the reactive function', () => {
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
    const result = testChimericSync.useSync();
    expect(result).toEqual('test');
    expect(mockIdiomaticSync).not.toHaveBeenCalled();
    expect(mockReactiveSync.useSync).toHaveBeenCalled();
  });

  it('should invoke the reactive function with params', () => {
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
    const result = testChimericSync.useSync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticSync).not.toHaveBeenCalled();
    expect(mockReactiveSync.useSync).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should throw an error for invalid inputs', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const invalidReactive = {
      notUseSync: makeSyncFnWithoutParamsReturnsString(),
    };

    expect(() => {
      fuseChimericSync({
        idiomatic: mockIdiomaticSync,
        reactive: invalidReactive as any,
      });
    }).toThrow('chimericFn is not qualified to be chimeric sync');
  });

  it('should handle type annotations without params', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithoutParamsReturnsString(),
    );
    const testChimericSync: ChimericSyncWithoutParamsReturnsString =
      fuseChimericSync({
        idiomatic: mockIdiomaticSync,
        reactive: mockReactiveSync,
      });
    const result = testChimericSync();
    expect(result).toEqual('test');
  });

  it('should handle type annotations with params', () => {
    const mockIdiomaticSync = createIdiomaticSync(
      makeSyncFnWithParamsReturnsString(),
    );
    const mockReactiveSync = createReactiveSync(
      makeSyncFnWithParamsReturnsString(),
    );
    const testChimericSync: ChimericSyncWithParamsReturnsString =
      fuseChimericSync({
        idiomatic: mockIdiomaticSync,
        reactive: mockReactiveSync,
      });
    const result = testChimericSync({ name: 'John' });
    expect(result).toEqual('Hello John');
  });
});
