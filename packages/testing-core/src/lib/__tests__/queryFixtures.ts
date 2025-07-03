export const makeReactiveQueryWithoutParamsReturnsString = () => ({
  useQuery: vi.fn(() => ({
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
    refetch: vi.fn(),
    native: {},
  })),
});

export const makeReactiveQueryWithParamsReturnsString = () => ({
  useQuery: vi.fn((args: { name: string }) => ({
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: `Hello ${args.name}`,
    refetch: vi.fn(),
    native: {},
  })),
});
