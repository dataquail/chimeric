import { QueryClient } from '@tanstack/react-query';
import { IdiomaticMutationFactory } from './IdiomaticMutationFactory';
import {
  makeAsyncFnWithoutParamsReturnsString,
  makeAsyncFnWithParamsReturnsString,
} from '../../__tests__/functionFixtures';
import {
  IdiomaticMutationWithoutParamsReturnsString,
  IdiomaticMutationWithParamsReturnsString,
} from '../__tests__/mutationFixtures';

describe('IdiomaticMutationFactory', () => {
  it('should invoke the idiomatic fn', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticMutation = IdiomaticMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });
    const result = await idiomaticMutation();

    expect(result).toBe('test');
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('should invoke the idiomatic fn with params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticMutation = IdiomaticMutationFactory(queryClient, {
      mutationFn: mockMutationFn,
    });
    const result = await idiomaticMutation({ name: 'John' });

    expect(result).toBe('Hello John');
    expect(mockMutationFn).toHaveBeenCalledWith({ name: 'John' });
  });

  it('should handle type annotations without params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = makeAsyncFnWithoutParamsReturnsString();
    const idiomaticMutation: IdiomaticMutationWithoutParamsReturnsString =
      IdiomaticMutationFactory(queryClient, {
        mutationFn: mockMutationFn,
      });
    const result = await idiomaticMutation();
    expect(result).toBe('test');
    expect(mockMutationFn).toHaveBeenCalled();
  });

  it('should handle type annotations with params', async () => {
    const queryClient = new QueryClient();
    const mockMutationFn = makeAsyncFnWithParamsReturnsString();
    const idiomaticMutation: IdiomaticMutationWithParamsReturnsString =
      IdiomaticMutationFactory(queryClient, {
        mutationFn: mockMutationFn,
      });
    const result = await idiomaticMutation({ name: 'John' });
    expect(result).toBe('Hello John');
    expect(mockMutationFn).toHaveBeenCalledWith({ name: 'John' });
  });
});
