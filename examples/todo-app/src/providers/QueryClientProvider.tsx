import { ReactNode } from 'react';
import { injectComponent } from 'src/utils/inversify/injectComponent';
import { appContainer } from 'src/core/global/appContainer';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';

type InjectedProps = {
  queryClientProvider: InjectionType<'IQueryClientProvider'>;
};

type OwnProps = {
  children: ReactNode;
};

export const QueryClientProvider = injectComponent<InjectedProps, OwnProps>(
  ({ children, queryClientProvider }) => {
    return (
      <ReactQueryClientProvider client={queryClientProvider.get()}>
        {children}
      </ReactQueryClientProvider>
    );
  },
  appContainer,
  {
    queryClientProvider: InjectionSymbol('IQueryClientProvider'),
  },
);
