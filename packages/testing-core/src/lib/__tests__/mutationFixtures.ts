export const makeReactiveMutationWithoutParamsReturnsString = () => ({
  use: vi.fn(() => ({
    invoke: vi.fn(() => Promise.resolve('test')),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
    reset: vi.fn(() => Promise.resolve()),
    native: null,
  })),
});

export const makeReactiveMutationWithParamsReturnsString = () => ({
  use: vi.fn(() => ({
    invoke: vi.fn((args: { name: string }) =>
      Promise.resolve(`Hello ${args.name}`),
    ),
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: 'Hello John',
    reset: vi.fn(() => Promise.resolve()),
    native: null,
  })),
});
