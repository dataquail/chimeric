import { IdiomaticQueryTestHarness } from '../IdiomaticQueryTestHarness';
import {
  makeIdiomaticQueryWithOptionalParamsReturnsString,
  makeIdiomaticQueryWithoutParamsReturnsString,
  makeIdiomaticQueryWithParamsReturnsString,
} from '../../__tests__/queryFixtures';

describe('IdiomaticQueryTestHarness', () => {
  it('should wait for success', async () => {
    const mockPromise = makeIdiomaticQueryWithoutParamsReturnsString();
    const query = IdiomaticQueryTestHarness({
      idiomaticQuery: mockPromise,
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith();
  });

  it('should reinvokeIdiomaticFn', async () => {
    const mockPromise = makeIdiomaticQueryWithoutParamsReturnsString();
    const query = IdiomaticQueryTestHarness({
      idiomaticQuery: mockPromise,
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith();

    await query.waitFor(
      () => expect(query.result.current.isSuccess).toBe(true),
      { reinvokeIdiomaticFn: true },
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('test');
    expect(mockPromise).toHaveBeenCalledTimes(2);
    expect(mockPromise).toHaveBeenCalledWith();
  });

  it('should handle params', async () => {
    const mockPromise = makeIdiomaticQueryWithParamsReturnsString();
    const query = IdiomaticQueryTestHarness({
      idiomaticQuery: mockPromise,
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle optional params with params', async () => {
    const mockPromise = makeIdiomaticQueryWithOptionalParamsReturnsString();
    const query = IdiomaticQueryTestHarness({
      idiomaticQuery: mockPromise,
      params: { name: 'John' },
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello John');
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle optional params with no params', async () => {
    const mockPromise = makeIdiomaticQueryWithOptionalParamsReturnsString();
    const query = IdiomaticQueryTestHarness({
      idiomaticQuery: mockPromise,
    });

    expect(query.result.current.isIdle).toBe(false);
    expect(query.result.current.isPending).toBe(true);
    expect(query.result.current.isSuccess).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe(undefined);

    await query.waitFor(() =>
      expect(query.result.current.isSuccess).toBe(true),
    );

    expect(query.result.current.isSuccess).toBe(true);
    expect(query.result.current.isPending).toBe(false);
    expect(query.result.current.isError).toBe(false);
    expect(query.result.current.error).toBe(null);
    expect(query.result.current.data).toBe('Hello');
    expect(mockPromise).toHaveBeenCalledTimes(1);
    expect(mockPromise).toHaveBeenCalledWith();
  });
});
