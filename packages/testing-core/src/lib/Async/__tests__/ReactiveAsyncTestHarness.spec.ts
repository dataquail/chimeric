import { createReactiveAsync } from '@chimeric/core';
import { ReactiveAsyncTestHarness } from '../ReactiveAsyncTestHarness';
import {
  makeReactiveAsyncWithoutParamsReturnsString,
  makeReactiveAsyncWithParamsReturnsString,
} from '../../__tests__/asyncFixtures';

describe('ReactiveAsyncTestHarness', () => {
  it('should be a function', () => {
    const mockReactiveAsync = createReactiveAsync(
      makeReactiveAsyncWithoutParamsReturnsString(),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
    });

    harness.result.current.call();

    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(harness.result.current.call).toHaveBeenCalled();
  });

  it('should accept options', async () => {
    const mockReactiveAsync = createReactiveAsync(
      makeReactiveAsyncWithoutParamsReturnsString(),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
      reactiveOptions: { retry: 3 },
    });

    await harness.result.current.call();
    expect(harness.result.current.call).toHaveBeenCalledTimes(1);
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 3 });
  });

  it('should take options with params', async () => {
    const mockReactiveAsync = createReactiveAsync(
      makeReactiveAsyncWithParamsReturnsString(),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
      reactiveOptions: { retry: 3 },
    });

    harness.result.current.call({ name: 'John' });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe('Hello John');
    expect(harness.result.current.call).toHaveBeenCalledTimes(1);
    expect(harness.result.current.call).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 3 });
  });
});
