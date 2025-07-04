import { ReactiveEagerAsyncTestHarness } from '../ReactiveEagerAsyncTestHarness';
import {
  makeReactiveEagerAsyncWithoutParamsReturnsString,
  makeReactiveEagerAsyncWithParamsReturnsString,
} from '../../__tests__/eagerAsyncFixtures';

describe('ReactiveEagerAsyncTestHarness', () => {
  it('should handle no params', async () => {
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithoutParamsReturnsString();
    ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: mockReactiveEagerAsync,
    });

    expect(mockReactiveEagerAsync.useEagerAsync).toHaveBeenCalledTimes(1);
  });

  it('should handle params', async () => {
    const mockReactiveEagerAsync =
      makeReactiveEagerAsyncWithParamsReturnsString();
    ReactiveEagerAsyncTestHarness({
      reactiveEagerAsync: mockReactiveEagerAsync,
      params: { name: 'John' },
    });

    expect(mockReactiveEagerAsync.useEagerAsync).toHaveBeenCalledTimes(1);
    expect(mockReactiveEagerAsync.useEagerAsync).toHaveBeenCalledWith({
      name: 'John',
    });
  });
});
