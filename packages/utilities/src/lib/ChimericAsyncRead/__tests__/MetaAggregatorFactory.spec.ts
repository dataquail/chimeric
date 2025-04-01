import { MetaAggregatorFactory } from '../MetaAggregatorFactory';
import { Reactive } from '@chimeric/core';

describe('MetaAggregatorFactory', () => {
  const reactiveIdle: Reactive<string | undefined, Error> = {
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
  };

  const reactiveLoading: Reactive<string | undefined, Error> = {
    isIdle: false,
    isPending: true,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
  };

  const reactiveError: Reactive<string | undefined, Error> = {
    isIdle: false,
    isPending: false,
    isSuccess: false,
    isError: true,
    error: new Error('test'),
    data: undefined,
  };

  const reactiveSuccess: Reactive<string, Error> = {
    isIdle: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    data: 'test',
  };

  it('should aggregate pending', () => {
    const meta = MetaAggregatorFactory(
      [reactiveLoading, reactiveSuccess],
      (metaList) => {
        return metaList;
      },
    );

    expect(meta.isIdle).toEqual(false);
    expect(meta.isPending).toEqual(true);
    expect(meta.isSuccess).toEqual(false);
    expect(meta.isError).toEqual(false);
    expect(meta.error).toBeUndefined();
    expect(meta.data).toBeUndefined();
  });

  it('should aggregate error', () => {
    const meta = MetaAggregatorFactory(
      [reactiveLoading, reactiveError],
      (metaList) => {
        return metaList;
      },
    );

    expect(meta.isIdle).toEqual(false);
    expect(meta.isPending).toEqual(true);
    expect(meta.isSuccess).toEqual(false);
    expect(meta.isError).toEqual(true);
    expect(meta.error).toEqual(new Error('test'));
    expect(meta.data).toBeUndefined();
  });

  it('should aggregate success', () => {
    const meta = MetaAggregatorFactory(
      [reactiveSuccess, reactiveSuccess],
      (metaList) => {
        return [metaList[0], metaList[1]];
      },
    );

    expect(meta.isIdle).toEqual(false);
    expect(meta.isPending).toEqual(false);
    expect(meta.isSuccess).toEqual(true);
    expect(meta.isError).toEqual(false);
    expect(meta.error).toBeUndefined();
    expect(meta.data?.length).toEqual(2);
    expect(meta.data?.[0]).toEqual('test');
    expect(meta.data?.[1]).toEqual('test');
  });

  it('should aggregate idle', () => {
    const meta = MetaAggregatorFactory(
      [reactiveIdle, reactiveIdle],
      (metaList) => {
        return metaList;
      },
    );

    expect(meta.isIdle).toEqual(true);
    expect(meta.isPending).toEqual(false);
    expect(meta.isSuccess).toEqual(false);
    expect(meta.isError).toEqual(false);
    expect(meta.error).toBeUndefined();
    expect(meta.data).toBeUndefined();
  });
});
