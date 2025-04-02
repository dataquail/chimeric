import { QueryClient } from '@tanstack/react-query';
import { IdiomaticMutationFactory } from '../IdiomaticMutationFactory';

describe('IdiomaticMutationFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn(() => Promise.resolve('test'));
    const idiomaticMutation = IdiomaticMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });
    const result = await idiomaticMutation();

    expect(result).toBe('test');
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const idiomaticMutation = IdiomaticMutationFactory(queryClient, {
      mutationFn: async (args: { name: string }) => mockMutationFn(args),
    });
    const result = await idiomaticMutation({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockMutationFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
