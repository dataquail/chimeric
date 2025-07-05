export const makeReactiveQueryWithoutParamsReturnsString = () => ({
  use: vi.fn(() => ({
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
    refetch: vi.fn(),
    native: null,
  })),
});

export const makeReactiveQueryWithParamsReturnsString = () => ({
  use: vi.fn((args: { name: string }) => ({
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: `Hello ${args.name}`,
    refetch: vi.fn(),
    native: null,
  })),
});
