import { ReactiveQueryTestHarness } from '../ReactiveQueryTestHarness';
import {
  makeReactiveQueryWithOptionalParamsReturnsString,
  makeReactiveQueryWithoutParamsReturnsString,
  makeReactiveQueryWithParamsReturnsString,
} from '../../__tests__/queryFixtures';

describe('ReactiveQueryTestHarness', () => {
  it('should be a function', () => {
    const mockReactiveQuery = makeReactiveQueryWithoutParamsReturnsString();
    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
    });

    expect(mockReactiveQuery.use).toHaveBeenCalled();

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(2);
    expect(mockReactiveQuery.use).toHaveBeenCalledWith(undefined, {
      options: { enabled: false },
      nativeOptions: undefined,
    });
  });

  it('should handle params', () => {
    const mockReactiveQuery = makeReactiveQueryWithParamsReturnsString();

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      params: { name: 'John' },
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith({ name: 'John' });
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      params: { name: 'John' },
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith(
      { name: 'John' },
      {
        options: { enabled: false },
        nativeOptions: undefined,
      },
    );
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(2);
  });

  it('should handle optional params', () => {
    const mockReactiveQuery =
      makeReactiveQueryWithOptionalParamsReturnsString();

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      params: { name: 'Jane' },
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith({ name: 'Jane' });
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(1);

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith();
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(2);

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith(undefined, {
      options: { enabled: false },
      nativeOptions: undefined,
    });
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(3);

    ReactiveQueryTestHarness({
      reactiveQuery: mockReactiveQuery,
      params: { name: 'Jane' },
      options: { enabled: false },
      nativeOptions: undefined,
    });

    expect(mockReactiveQuery.use).toHaveBeenCalledWith(
      { name: 'Jane' },
      {
        options: { enabled: false },
        nativeOptions: undefined,
      },
    );
    expect(mockReactiveQuery.use).toHaveBeenCalledTimes(4);
  });
});
