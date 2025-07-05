import { ChimericMutationFactory } from '@chimeric/react-query';
import { ChimericMutationTestHarness } from '../ChimericMutationTestHarness';
import { QueryClient } from '@tanstack/react-query';
import { getTestWrapper } from '../../__tests__/getTestWrapper';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';

describe('ChimericMutationTestHarness', () => {
  it('reactive no params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = makeAsyncFnWithoutParamsReturnsString();
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    await harness.result.current.invoke();
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('reactive with params', async () => {
    const queryClient = new QueryClient();
    const mockFn = makeAsyncFnWithParamsReturnsString();
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockFn,
    });
    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'reactive',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.invoke({ name: 'John' });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });

  it('idiomatic no params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = makeAsyncFnWithoutParamsReturnsString();
    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });
    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.invoke();
    expect(mockMutationFn).toHaveBeenCalled();
    expect(result).toBe('test');
  });

  it('idiomatic with params', async () => {
    const queryClient = new QueryClient();
    const mockFn = makeAsyncFnWithParamsReturnsString();

    const chimericMutation = ChimericMutationFactory(queryClient, {
      mutationFn: mockFn,
    });
    const harness = ChimericMutationTestHarness({
      chimericMutation,
      method: 'idiomatic',
      wrapper: getTestWrapper(queryClient),
    });

    const result = await harness.result.current.invoke({ name: 'John' });
    expect(mockFn).toHaveBeenCalled();
    expect(result).toBe('Hello John');
  });
});
