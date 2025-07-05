import { createReactiveAsync, DefineReactiveAsync } from '@chimeric/core';
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

    harness.result.current.invoke();

    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(harness.result.current.invoke).toHaveBeenCalled();
  });

  it('should accept options', async () => {
    const mockReactiveAsync = createReactiveAsync(
      makeReactiveAsyncWithoutParamsReturnsString(),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
      reactiveOptions: { retry: 3 },
    });

    await harness.result.current.invoke();
    expect(harness.result.current.invoke).toHaveBeenCalledTimes(1);
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

    harness.result.current.invoke({ name: 'John' });

    expect(harness.result.current.isIdle).toBe(false);
    expect(harness.result.current.isPending).toBe(false);
    expect(harness.result.current.isSuccess).toBe(true);
    expect(harness.result.current.error).toBe(null);
    expect(harness.result.current.data).toBe('Hello John');
    expect(harness.result.current.invoke).toHaveBeenCalledTimes(1);
    expect(harness.result.current.invoke).toHaveBeenCalledWith({
      name: 'John',
    });
    expect(mockReactiveAsync.useAsync).toHaveBeenCalledWith({ retry: 3 });
  });

  it('should handle type annotations without params', () => {
    type TestReactiveAsync = DefineReactiveAsync<() => Promise<string>>;
    const mockReactiveAsync: TestReactiveAsync = createReactiveAsync(
      makeReactiveAsyncWithoutParamsReturnsString(),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
    });

    harness.result.current.invoke();

    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(harness.result.current.invoke).toHaveBeenCalled();
  });

  it('should handle type annotations with params', () => {
    type TestReactiveAsync = DefineReactiveAsync<
      (params: { name: string }) => Promise<string>
    >;
    const mockReactiveAsync: TestReactiveAsync = createReactiveAsync(
      makeReactiveAsyncWithParamsReturnsString(),
    );

    const harness = ReactiveAsyncTestHarness({
      reactiveAsync: mockReactiveAsync,
    });

    harness.result.current.invoke({ name: 'John' });

    expect(mockReactiveAsync.useAsync).toHaveBeenCalled();
    expect(harness.result.current.invoke).toHaveBeenCalled();
  });
});
