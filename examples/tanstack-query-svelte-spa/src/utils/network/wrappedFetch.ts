export const wrappedFetch = async <T>(
  endpoint: string,
  fetchOptionsOverride: Parameters<typeof fetch>[1] = {},
): Promise<T> => {
  const fetchOptions = {
    cache: 'no-store' as const,
    method: 'get',
    ...fetchOptionsOverride,
  };

  const response = await fetch(endpoint, fetchOptions);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
