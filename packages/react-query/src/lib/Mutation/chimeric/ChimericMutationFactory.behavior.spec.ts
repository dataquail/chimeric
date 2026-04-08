import { act } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericMutationFactory } from './ChimericMutationFactory';

describe('ChimericMutationFactory - Behavior', () => {
  describe('BEHAVIOR: error handling', () => {
    it('surfaces errors in reactive interface', async () => {
      const queryClient = new QueryClient();
      const chimericMutation = ChimericMutationFactory({
        queryClient,
        mutationFn: async (): Promise<string> => {
          throw new Error('mutation failed');
        },
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(queryClient),
      });

      expect(result.current.isIdle).toBe(true);

      await act(async () => {
        try {
          await result.current.invoke();
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('mutation failed');
      expect(result.current.data).toBeUndefined();
    });

    it('surfaces errors with params in reactive interface', async () => {
      const queryClient = new QueryClient();
      const chimericMutation = ChimericMutationFactory({
        queryClient,
        mutationFn: async (_params: { name: string }): Promise<string> => {
          throw new Error('mutation failed');
        },
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(queryClient),
      });

      await act(async () => {
        try {
          await result.current.invoke({ name: 'John' });
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('mutation failed');
    });

    it('throws errors in idiomatic interface', async () => {
      const queryClient = new QueryClient();
      const chimericMutation = ChimericMutationFactory({
        queryClient,
        mutationFn: async (): Promise<string> => {
          throw new Error('mutation failed');
        },
      });

      await expect(chimericMutation()).rejects.toThrow('mutation failed');
    });

    it('throws errors with params in idiomatic interface', async () => {
      const queryClient = new QueryClient();
      const chimericMutation = ChimericMutationFactory({
        queryClient,
        mutationFn: async (_params: { name: string }): Promise<string> => {
          throw new Error('mutation failed');
        },
      });

      await expect(
        chimericMutation({ name: 'John' }),
      ).rejects.toThrow('mutation failed');
    });
  });

  describe('BEHAVIOR: reset', () => {
    it('returns to idle state after reset', async () => {
      const queryClient = new QueryClient();
      const chimericMutation = ChimericMutationFactory({
        queryClient,
        mutationFn: async () => 'result',
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(queryClient),
      });

      expect(result.current.isIdle).toBe(true);
      expect(result.current.data).toBeUndefined();

      await act(async () => result.current.invoke());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBe('result');

      act(() => result.current.reset());

      await waitFor(() => {
        expect(result.current.isIdle).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
    });

    it('returns to idle state after error and reset', async () => {
      const queryClient = new QueryClient();
      const chimericMutation = ChimericMutationFactory({
        queryClient,
        mutationFn: async (): Promise<string> => {
          throw new Error('mutation failed');
        },
      });

      const { result } = renderHook(() => chimericMutation.useHook(), {
        wrapper: getTestWrapper(queryClient),
      });

      await act(async () => {
        try {
          await result.current.invoke();
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      act(() => result.current.reset());

      await waitFor(() => {
        expect(result.current.isIdle).toBe(true);
      });

      expect(result.current.error).toBeNull();
    });
  });
});
