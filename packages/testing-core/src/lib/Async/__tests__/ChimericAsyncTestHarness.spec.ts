import { ChimericAsyncTestHarness } from '../ChimericAsyncTestHarness';
import {
  createIdiomaticAsync,
  fuseChimericAsync,
  createReactiveAsync,
} from '@chimeric/core';
import {
  makeReactiveAsyncWithoutParamsReturnsString,
  makeReactiveAsyncWithParamsReturnsString,
  makeIdiomaticAsyncWithoutParamsReturnsString,
  makeIdiomaticAsyncWithParamsReturnsString,
} from '../../__tests__/asyncFixtures';

describe('ChimericAsyncTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticAsync = createIdiomaticAsync(vi.fn(async () => 'test'));
    const mockReactiveAsync = createReactiveAsync(
      makeReactiveAsyncWithoutParamsReturnsString(),
    );

    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: mockReactiveAsync,
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: testChimericAsync,
      method: 'idiomatic',
    });

    harness.result.current.invoke();

    expect(mockIdiomaticAsync).toHaveBeenCalled();
  });

  it('should handle type annotations without params', () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithoutParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithoutParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: createReactiveAsync(mockReactiveAsync),
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: testChimericAsync,
      method: 'reactive',
    });

    harness.result.current.invoke();
    expect(mockReactiveAsync).toHaveBeenCalled();
    expect(mockReactiveAsync).toHaveBeenCalledWith({});
  });

  it('should handle type annotations with params', () => {
    const mockIdiomaticAsync = makeIdiomaticAsyncWithParamsReturnsString();
    const mockReactiveAsync = makeReactiveAsyncWithParamsReturnsString();
    const testChimericAsync = fuseChimericAsync({
      idiomatic: mockIdiomaticAsync,
      reactive: createReactiveAsync(mockReactiveAsync),
    });

    const harness = ChimericAsyncTestHarness({
      chimericAsync: testChimericAsync,
      method: 'reactive',
    });

    harness.result.current.invoke({ name: 'John' });
    expect(harness.result.current.invoke).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
