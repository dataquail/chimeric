import { ReactiveMutationTestHarness } from '../ReactiveMutationTestHarness';
import {
  makeReactiveMutationWithoutParamsReturnsString,
  makeReactiveMutationWithParamsReturnsString,
} from '../../__tests__/mutationFixtures';

describe('ReactiveMutationTestHarness', () => {
  it('should be a function', () => {
    const mockReactiveMutation =
      makeReactiveMutationWithoutParamsReturnsString();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: mockReactiveMutation,
    });

    harness.result.current.call();

    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(harness.result.current.call).toHaveBeenCalled();
  });

  it('should handle params', async () => {
    const mockReactiveMutation = makeReactiveMutationWithParamsReturnsString();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: mockReactiveMutation,
    });

    const result = await harness.result.current.call({ name: 'John' });
    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(harness.result.current.call).toHaveBeenCalledTimes(1);
    expect(harness.result.current.call).toHaveBeenCalledWith({ name: 'John' });
    expect(result).toBe('Hello John');
  });
});
