import { ChimericAsyncTestHarness } from '../ChimericAsyncTestHarness';
import { DefineChimericAsync, fuseChimericAsync } from '@chimeric/core';

describe('ChimericAsyncTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticAsync = vi.fn(async () => 'test');
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };

    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: testChimericAsync,
      method: 'idiomatic',
    });

    harness.result.current.call();

    expect(mockIdiomaticAsync).toHaveBeenCalled();
  });

  it('should handle type annotations without params', () => {
    const mockIdiomaticAsync = vi.fn(async () => 'test');
    const mockReactiveAsyncCall = vi.fn(() => Promise.resolve('test'));
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: mockReactiveAsyncCall,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
    type TestChimericAsync = DefineChimericAsync<() => Promise<string>>;
    const testChimericAsync: TestChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: testChimericAsync,
      method: 'reactive',
    });

    harness.result.current.call();
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(mockReactiveAsyncCall).toHaveBeenCalled();
  });

  it('should handle type annotations with params', () => {
    const mockIdiomaticAsync = vi.fn(async (args: { name: string }) => {
      return `Hello ${args.name}`;
    });
    const mockReactiveAsyncCall = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const mockReactiveAsync = {
      useAsync: vi.fn(() => ({
        call: mockReactiveAsyncCall,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
      })),
    };
    type TestChimericAsync = DefineChimericAsync<
      (args: { name: string }) => Promise<string>
    >;
    const testChimericAsync: TestChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: testChimericAsync,
      method: 'reactive',
    });

    harness.result.current.call({ name: 'John' });
    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(mockReactiveAsyncCall).toHaveBeenCalled();
  });
});
