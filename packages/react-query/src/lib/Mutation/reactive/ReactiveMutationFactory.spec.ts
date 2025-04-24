import { act } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ReactiveMutationFactory } from '../ReactiveMutationFactory';

describe('ReactiveMutationFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn(() => Promise.resolve('test'));
    const reactiveMutation = ReactiveMutationFactory({
      mutationFn: mockMutationFn,
    });
    const { result } = renderHook(reactiveMutation.useMutation, {
      wrapper: getTestWrapper(queryClient),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('test');
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const reactiveMutation = ReactiveMutationFactory({
      mutationFn: async (args: { name: string }) => mockMutationFn(args),
    });
    const { result } = renderHook(() => reactiveMutation.useMutation(), {
      wrapper: getTestWrapper(queryClient),
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.isSuccess).toBe(false);

    await act(async () => result.current.call({ name: 'John' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe('Hello John');
    expect(mockMutationFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
