/* eslint-disable @typescript-eslint/no-explicit-any */
import { createIdiomaticSync } from '../idiomatic/createIdiomaticSync';
import { createReactiveSync } from '../reactive/createReactiveSync';
import { fuseChimericSync } from './fuseChimericSync';

describe('fuseChimericSync', () => {
  it('should invoke the idiomatic function', () => {
    const mockIdiomaticSync = createIdiomaticSync(vi.fn(() => 'test'));
    const mockReactiveSync = createReactiveSync(vi.fn(() => 'test'));
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
      vi.fn((args: { name: string }) => `Hello ${args.name}`),
    );
    const mockReactiveSync = createReactiveSync(
      vi.fn((args: { name: string }) => `Hello ${args.name}`),
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
    const mockIdiomaticSync = createIdiomaticSync(vi.fn(() => 'test'));
    const mockReactiveSync = createReactiveSync(vi.fn(() => 'test'));
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
      vi.fn((args: { name: string }) => `Hello ${args.name}`),
    );
    const mockReactiveSync = createReactiveSync(
      vi.fn((args: { name: string }) => `Hello ${args.name}`),
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
    const mockIdiomaticSync = createIdiomaticSync(vi.fn(() => 'test'));
    const invalidReactive = {
      notUseSync: vi.fn(),
    };

    expect(() => {
      fuseChimericSync({
        idiomatic: mockIdiomaticSync,
        reactive: invalidReactive as any,
      });
    }).toThrow('chimericFn is not qualified to be chimeric sync');
  });
});
