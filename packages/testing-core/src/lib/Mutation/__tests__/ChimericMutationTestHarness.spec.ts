import { DefineChimericMutation, fuseChimericMutation } from '@chimeric/core';
import { ChimericMutationTestHarness } from '../ChimericMutationTestHarness';

describe('ChimericMutationTestHarness', () => {
  it('should be a function', () => {
    const mockIdiomaticMutation = vi.fn(async () => 'test');
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: vi.fn(() => Promise.resolve('test')),
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
        native: {},
      })),
    };

    const testChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation: testChimericMutation,
      method: 'idiomatic',
    });

    harness.result.current.call();

    expect(mockIdiomaticMutation).toHaveBeenCalled();
  });

  it('should handle type annotations without params', () => {
    const mockIdiomaticMutation = vi.fn(async () => 'test');
    const mockReactiveMutationCall = vi.fn(() => Promise.resolve('test'));
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: mockReactiveMutationCall,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
        native: {},
      })),
    };
    type TestChimericMutation = DefineChimericMutation<() => Promise<string>>;
    const testChimericMutation: TestChimericMutation = fuseChimericMutation({
      idiomatic: mockIdiomaticMutation,
      reactive: mockReactiveMutation,
    });

    const harness = ChimericMutationTestHarness({
      chimericMutation: testChimericMutation,
      method: 'reactive',
    });

    harness.result.current.call();
    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(mockReactiveMutationCall).toHaveBeenCalled();
  });

  it('should handle type annotations with params', () => {
    const mockIdiomaticMutation = vi.fn(async (args: { name: string }) => {
      return `Hello ${args.name}`;
    });
    const mockReactiveMutationCall = vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    );
    const mockReactiveMutation = {
      useMutation: vi.fn(() => ({
        call: mockReactiveMutationCall,
        isIdle: true,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
        data: undefined,
        reset: vi.fn(),
        native: {},
      })),
    };
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

    harness.result.current.call({ name: 'John' });
    expect(mockReactiveMutation.useMutation).toHaveBeenCalled();
    expect(mockReactiveMutationCall).toHaveBeenCalled();
  });
});
