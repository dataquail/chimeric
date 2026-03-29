import { ReactNode } from 'react';
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { container } from 'src/core/global/container';

type Props = {
  children: ReactNode;
};

export const QueryClientProvider = ({ children }: Props) => {
  return (
    <ReactQueryClientProvider client={container.queryClientProvider.get()}>
      {children}
    </ReactQueryClientProvider>
  );
};
