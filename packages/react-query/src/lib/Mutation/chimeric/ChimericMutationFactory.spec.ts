import { act } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import { ChimericMutationFactory } from './ChimericMutationFactory';

describe('ChimericMutationFactory', () => {
  it('should invoke the reactive hook', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn(() => Promise.resolve('test'));
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });
    const { result } = renderHook(chimericMutation.useMutation, {
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

  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn(() => Promise.resolve('test'));
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });
    const result = await chimericMutation();

    expect(result).toBe('test');
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('should invoke the reactive hook with params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: async (args: { name: string }) => mockMutationFn(args),
    });
    const { result } = renderHook(() => chimericMutation.useMutation(), {
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

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: async (args: { name: string }) => mockMutationFn(args),
    });
    const result = await chimericMutation({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockMutationFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
