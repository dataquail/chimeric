import { appContainer } from 'src/core/global/appContainer';
import { injectComponent } from 'src/utils/inversify/injectComponent';
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

type InjectedProps = {
  queryClientProvider: InjectionType<'IQueryClientProvider'>;
};

type OwnProps = {
  children: React.ReactNode;
};

export const ReactQueryTestWrapper = injectComponent<InjectedProps, OwnProps>(
  (props) => {
    props.queryClientProvider.get().setDefaultOptions({
      queries: {
        // ✅ turns retries off
        retry: false,
        staleTime: Infinity,
      },
    });

    return (
      <ReactQueryClientProvider client={props.queryClientProvider.get()}>
        {props.children}
      </ReactQueryClientProvider>
    );
  },
  appContainer,
  {
    queryClientProvider: InjectionSymbol('IQueryClientProvider'),
  },
);
