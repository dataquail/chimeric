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

    harness.result.current.invoke();

    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(harness.result.current.invoke).toHaveBeenCalled();
  });

  it('should handle params', async () => {
    const mockReactiveMutation = makeReactiveMutationWithParamsReturnsString();

    const harness = ReactiveMutationTestHarness({
      reactiveMutation: mockReactiveMutation,
    });

    const result = await harness.result.current.invoke({ name: 'John' });
    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(harness.result.current.invoke).toHaveBeenCalledTimes(1);
    expect(harness.result.current.invoke).toHaveBeenCalledWith({
      name: 'John',
    });
    expect(result).toBe('Hello John');
  });
});
