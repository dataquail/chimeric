import { ChimericMutationFactory } from '@chimeric/react-query';
import { ChimericMutationTestHarness } from '../ChimericMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';

describe('ChimericMutationTestHarness', () => {
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  it('reactive no params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn(() => Promise.resolve('test'));
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    await harness.result.current.call();
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('reactive with params', async () => {
    const queryClient = new QueryClient();
    const mockFn = vi.fn(async (args: { id: string }) => {
      await wait(100);
      return 'test' + args.id;
    });
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockFn,
    });
    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.call({ id: '123' });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ id: '123' });
    expect(result).toBe('test123');
  });

  it('idiomatic no params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = vi.fn(() => Promise.resolve('test'));
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });
    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.call();
    expect(mockMutationFn).toHaveBeenCalled();
    expect(result).toBe('test');
  });

  it('idiomatic with params', async () => {
    const queryClient = new QueryClient();
    const mockFn = vi.fn(async (args: { id: string }) => {
      await wait(100);
      return 'test' + args.id;
    });

    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockFn,
    });
    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.call({ id: '123' });
    expect(mockFn).toHaveBeenCalled();
    expect(result).toBe('test123');
  });
});
