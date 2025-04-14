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
    type TestChimericAsync = DefineChimericAsync<() => Promise<string>>;
    const testChimericAsync: TestChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: testChimericAsync,
      method: 'idiomatic',
    });

    harness.result.current.call();
  });
});
