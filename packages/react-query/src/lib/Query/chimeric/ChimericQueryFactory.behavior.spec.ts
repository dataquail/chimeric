import { act } from 'react';
import { QueryClient, queryOptions } from '@tanstack/react-query';
import { ChimericQueryFactory } from './ChimericQueryFactory';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

describe('ChimericQueryFactory - Behavior', () => {
  describe('BEHAVIOR: enabled option', () => {
    it('does not fetch when enabled is false', async () => {
      const queryClient = new QueryClient();
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test-disabled'],
            queryFn: async () => 'fetched',
          }),
      });

      const { result } = renderHook(
        () => chimericQuery.useHook({ options: { enabled: false } }),
        { wrapper: getTestWrapper(queryClient) },
      );

      await new Promise((r) => setTimeout(r, 50));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });

    it('fetches when enabled is explicitly true', async () => {
      const queryClient = new QueryClient();
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test-enabled'],
            queryFn: async () => 'fetched',
          }),
      });

      const { result } = renderHook(
        () => chimericQuery.useHook({ options: { enabled: true } }),
        { wrapper: getTestWrapper(queryClient) },
      );

      await waitFor(() => {
        expect(result.current.isPending).toBe(false);
      });

      expect(result.current.data).toBe('fetched');
      expect(result.current.isSuccess).toBe(true);
    });

    it('does not fetch when enabled is false with params', async () => {
      const queryClient = new QueryClient();
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test-disabled-params', args.name],
            queryFn: async () => `Hello ${args.name}`,
          }),
      });

      const { result } = renderHook(
        () =>
          chimericQuery.useHook({ name: 'John' }, { options: { enabled: false } }),
        { wrapper: getTestWrapper(queryClient) },
      );

      await new Promise((r) => setTimeout(r, 50));

      expect(result.current.data).toBeUndefined();
      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('BEHAVIOR: forceRefetch option', () => {
    it('returns cached data when forceRefetch is not set', async () => {
      let callCount = 0;
      const queryClient = new QueryClient();
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test-cache'],
            queryFn: async () => `call-${++callCount}`,
            staleTime: Infinity,
          }),
      });

      const result1 = await chimericQuery();
      expect(result1).toBe('call-1');

      const result2 = await chimericQuery();
      expect(result2).toBe('call-1');
    });

    it('bypasses cache when forceRefetch is true', async () => {
      let callCount = 0;
      const queryClient = new QueryClient();
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test-force'],
            queryFn: async () => `call-${++callCount}`,
            staleTime: Infinity,
          }),
      });

      const result1 = await chimericQuery();
      expect(result1).toBe('call-1');

      const result2 = await chimericQuery({ options: { forceRefetch: true } });
      expect(result2).toBe('call-2');
    });

    it('bypasses cache when forceRefetch is true with params', async () => {
      let callCount = 0;
      const queryClient = new QueryClient();
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: (args: { name: string }) =>
          queryOptions({
            queryKey: ['test-force-params', args.name],
            queryFn: async () => `${args.name}-call-${++callCount}`,
            staleTime: Infinity,
          }),
      });

      const result1 = await chimericQuery({ name: 'John' });
      expect(result1).toBe('John-call-1');

      const result2 = await chimericQuery(
        { name: 'John' },
        { options: { forceRefetch: true } },
      );
      expect(result2).toBe('John-call-2');
    });
  });

  describe('BEHAVIOR: reactive refetch', () => {
    it('returns fresh data on refetch', async () => {
      let callCount = 0;
      const queryClient = new QueryClient();
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test-refetch'],
            queryFn: async () => `call-${++callCount}`,
          }),
      });

      const { result } = renderHook(() => chimericQuery.useHook(), {
        wrapper: getTestWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.data).toBe('call-1');
      });

      let refetchData: string | undefined;
      await act(async () => {
        refetchData = await result.current.refetch();
      });

      expect(refetchData).toBe('call-2');

      await waitFor(() => {
        expect(result.current.data).toBe('call-2');
      });
    });
  });

  describe('BEHAVIOR: error handling', () => {
    it('surfaces errors in reactive interface', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test-error-reactive'],
            queryFn: async (): Promise<string> => {
              throw new Error('fetch failed');
            },
          }),
      });

      const { result } = renderHook(() => chimericQuery.useHook(), {
        wrapper: getTestWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('fetch failed');
      expect(result.current.data).toBeUndefined();
    });

    it('throws errors in idiomatic interface', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      const chimericQuery = ChimericQueryFactory({
        queryClient,
        getQueryOptions: () =>
          queryOptions({
            queryKey: ['test-error-idiomatic'],
            queryFn: async (): Promise<string> => {
              throw new Error('fetch failed');
            },
          }),
      });

      await expect(chimericQuery()).rejects.toThrow('fetch failed');
    });
  });
});
