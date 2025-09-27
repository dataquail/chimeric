import { ChimericInfiniteQueryTestHarness } from '../ChimericInfiniteQueryTestHarness';
import {
  makeChimericInfiniteQueryWithoutParams,
  makeChimericInfiniteQueryWithParams,
} from '../../__tests__/infiniteQueryFixtures';

describe('ChimericInfiniteQueryTestHarness', () => {
  it('should work with reactive method without params', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithoutParams();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'reactive',
    });

    expect(chimericInfiniteQuery.use).toHaveBeenCalled();
  });

  it('should work with reactive method with params', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithParams();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'reactive',
      params: { filter: 'active' },
    });

    expect(chimericInfiniteQuery.use).toHaveBeenCalledWith({
      filter: 'active',
    });
  });

  it('should work with idiomatic method without params', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithoutParams();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'idiomatic',
    });

    expect(chimericInfiniteQuery).toHaveBeenCalled();
  });

  it('should work with idiomatic method with params', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithParams();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'idiomatic',
      params: { filter: 'completed' },
    });

    expect(chimericInfiniteQuery).toHaveBeenCalledWith({ filter: 'completed' });
  });

  it('should handle reactive options', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithoutParams();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'reactive',
      reactiveOptions: {
        enabled: false,
      },
    });

    expect(chimericInfiniteQuery.use).toHaveBeenCalledWith({
      options: { enabled: false },
      nativeOptions: undefined,
    });
  });

  it('should handle idiomatic options', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithoutParams();

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'idiomatic',
      idiomaticOptions: {
        forceRefetch: true,
      },
    });

    expect(chimericInfiniteQuery).toHaveBeenCalledWith({
      options: { forceRefetch: true },
      nativeOptions: undefined,
    });
  });

  it('should handle native options for reactive method', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithoutParams();
    const nativeOptions = { staleTime: 5000 };

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'reactive',
      reactiveNativeOptions: nativeOptions,
    });

    expect(chimericInfiniteQuery.use).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions,
    });
  });

  it('should handle native options for idiomatic method', () => {
    const chimericInfiniteQuery = makeChimericInfiniteQueryWithoutParams();
    const nativeOptions = { staleTime: 5000 } as any;

    ChimericInfiniteQueryTestHarness({
      chimericInfiniteQuery,
      method: 'idiomatic',
      idiomaticNativeOptions: nativeOptions,
    });

    expect(chimericInfiniteQuery).toHaveBeenCalledWith({
      options: undefined,
      nativeOptions,
    });
  });
});
