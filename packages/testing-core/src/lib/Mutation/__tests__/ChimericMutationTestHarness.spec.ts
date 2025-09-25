import {
  DefineChimericMutation,
  fuseChimericMutation,
  DefineIdiomaticMutation,
} from '@chimeric/core';
import { ChimericMutationTestHarness } from '../ChimericMutationTestHarness';
import {
  makeIdiomaticMutationWithoutParamsReturnsString,
  makeIdiomaticMutationWithParamsReturnsString,
  makeReactiveMutationWithoutParamsReturnsString,
  makeReactiveMutationWithParamsReturnsString,
} from '../../__tests__/mutationFixtures';

describe('ChimericMutationTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticMutation =
      makeIdiomaticMutationWithoutParamsReturnsString();
    const mockReactiveMutation =
      makeReactiveMutationWithoutParamsReturnsString();

    const testChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation: testChimericMutation,
      method: 'idiomatic',
    });

    harness.result.current.invoke();

    expect(mockIdiomaticMutation).toHaveBeenCalled();
  });

  it('should handle type annotations without params', () => {
    type TestIdiomaticMutation = DefineIdiomaticMutation<() => Promise<string>>;
    const mockIdiomaticMutation: TestIdiomaticMutation =
      makeIdiomaticMutationWithoutParamsReturnsString();
    const mockReactiveMutation =
      makeReactiveMutationWithoutParamsReturnsString();
    type TestChimericMutation = DefineChimericMutation<() => Promise<string>>;
    const testChimericMutation: TestChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation: testChimericMutation,
      method: 'reactive',
    });

    harness.result.current.invoke();
    expect(mockReactiveMutation.use).toHaveBeenCalled();
    expect(harness.result.current.invoke).toHaveBeenCalled();
  });

  it('should handle type annotations with params', () => {
    type TestIdiomaticMutation = DefineIdiomaticMutation<
      (args: { name: string }) => Promise<string>
    >;
    const mockIdiomaticMutation: TestIdiomaticMutation =
      makeIdiomaticMutationWithParamsReturnsString();
    const mockReactiveMutation = makeReactiveMutationWithParamsReturnsString();

    type TestChimericMutation = DefineChimericMutation<
      (args: { name: string }) => Promise<string>
    >;
    const testChimericMutation: TestChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation: testChimericMutation,
      method: 'reactive',
    });

    harness.result.current.invoke({ name: 'John' });
    expect(mockReactiveMutation.use).toHaveBeenCalled();
    expect(harness.result.current.invoke).toHaveBeenCalled();
  });
});
