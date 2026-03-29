import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { container } from 'src/core/global/container';

type Props = {
  children: React.ReactNode;
};

export const ReactQueryTestWrapper = (props: Props) => {
  container.queryClientProvider.get().setDefaultOptions({
    queries: {
      // turns retries off
      retry: false,
      staleTime: Infinity,
    },
  });

  return (
    <ReactQueryClientProvider client={container.queryClientProvider.get()}>
      {props.children}
    </ReactQueryClientProvider>
  );
};
