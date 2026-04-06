import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { getContainer } from '@/core/global/container';

type Props = {
  children: React.ReactNode;
};

export const ReactQueryTestWrapper = (props: Props) => {
  const { queryClientProvider } = getContainer();
  queryClientProvider.get().setDefaultOptions({
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  });

  return (
    <ReactQueryClientProvider client={queryClientProvider.get()}>
      {props.children}
    </ReactQueryClientProvider>
  );
};
