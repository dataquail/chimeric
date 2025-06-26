export const makeReactiveMutationWithoutParamsReturnsString = () => ({
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
});

export const makeReactiveMutationWithParamsReturnsString = () => ({
  useMutation: vi.fn(() => ({
    call: vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    ),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: 'Hello John',
    reset: vi.fn(),
    native: {},
  })),
});
