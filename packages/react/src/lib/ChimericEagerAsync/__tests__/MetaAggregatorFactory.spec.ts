import { MetaAggregatorFactory } from '../MetaAggregatorFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { ChimericAsyncFactory } from '../../Async/ChimericAsyncFactory';
import {
  createIdiomaticAsync,
  createReactiveEagerAsync,
  DefineChimericAsync,
  fuseChimericEagerAsync,
  Reactive,
} from '@chimeric/core';
import { useEffect } from 'react';

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
      ([loading, success]) => {
        return loading || success;
      },
    );

    expect(meta.isIdle).toEqual(false);
    expect(meta.isPending).toEqual(true);
    expect(meta.isSuccess).toEqual(false);
    expect(meta.isError).toEqual(false);
    expect(meta.error).toBeUndefined();
    expect(meta.data).toEqual('test');
  });

  it('should aggregate error', () => {
    const meta = MetaAggregatorFactory(
      [reactiveLoading, reactiveError],
      ([loading, error]) => {
        return loading || error;
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
      ([idle1, idle2]) => {
        return idle1 || idle2;
      },
    );

    expect(meta.isIdle).toEqual(true);
    expect(meta.isPending).toEqual(false);
    expect(meta.isSuccess).toEqual(false);
    expect(meta.isError).toEqual(false);
    expect(meta.error).toBeUndefined();
    expect(meta.data).toBeUndefined();
  });

  describe('integration with Async', () => {
    it('should aggregate', async () => {
      type TestChimericAsync = DefineChimericAsync<
        (args: { number: number }) => Promise<string>
      >;
      const mockPromise = vi.fn((args: { number: number }) =>
        Promise.resolve(`+ ${args.number}`),
      );
      const chimericAsync: TestChimericAsync =
        ChimericAsyncFactory(mockPromise);

      const chimericEagerAsync = fuseChimericEagerAsync({
        idiomatic: createIdiomaticAsync(async (args: { number: number }) => {
          const number = await chimericAsync(args);
          return `+ ${number}`;
        }),
        reactive: createReactiveEagerAsync((args: { number: number }) => {
          const chimericAsyncResult = chimericAsync.useAsync();
          const { isSuccess, isPending, call } = chimericAsyncResult;

          useEffect(() => {
            if (!isSuccess && !isPending) {
              call(args);
            }
          }, [isSuccess, isPending, call, args]);

          return MetaAggregatorFactory([chimericAsyncResult], ([greeting]) => {
            if (!greeting) {
              return 'Nevermind';
            }
            return greeting;
          });
        }),
      });

      const { result } = renderHook(() =>
        chimericEagerAsync.useEagerAsync({ number: 1 }),
      );

      expect(result.current.isIdle).toEqual(false);
      expect(result.current.isPending).toEqual(true);
      expect(result.current.isSuccess).toEqual(false);
      expect(result.current.error).toBeUndefined();
      expect(result.current.data).toEqual('Nevermind');

      await waitFor(() => {
        expect(result.current.isSuccess).toEqual(true);
      });

      expect(result.current.data).toEqual('+ 1');
    });
  });
});
