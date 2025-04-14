import { fuseChimericSync } from '../Sync';

describe('fuseChimericSync', () => {
  it('should invoke the idiomatic function', () => {
    const mockIdiomaticSync = vi.fn(() => 'test');
    const mockReactiveSync = {
      useSync: vi.fn(() => 'test'),
    };
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
    const mockIdiomaticSync = vi.fn(
      (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveSync = {
      useSync: vi.fn((args: { name: string }) => `Hello ${args.name}`),
    };
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
    const mockIdiomaticSync = vi.fn(() => 'test');
    const mockReactiveSync = {
      useSync: vi.fn(() => 'test'),
    };
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
    const mockIdiomaticSync = vi.fn(
      (args: { name: string }) => `Hello ${args.name}`,
    );
    const mockReactiveSync = {
      useSync: vi.fn((args: { name: string }) => `Hello ${args.name}`),
    };
    const testChimericSync = fuseChimericSync({
      idiomatic: mockIdiomaticSync,
      reactive: mockReactiveSync,
    });
    const result = testChimericSync.useSync({ name: 'John' });
    expect(result).toEqual('Hello John');
    expect(mockIdiomaticSync).not.toHaveBeenCalled();
    expect(mockReactiveSync.useSync).toHaveBeenCalledWith({ name: 'John' });
  });
});
