import { injectComponent } from 'src/utils/inversify/InjectComponent/DI';
import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import { InjectionSymbol, type InjectionType } from 'src/core/global/types';

type InjectedProps = {
  queryClientProvider: InjectionType<'IQueryClientProvider'>;
};

type OwnProps = {
  children: React.ReactNode;
};

export const ReactQueryTestWrapper = injectComponent<InjectedProps, OwnProps>(
  { queryClientProvider: InjectionSymbol('IQueryClientProvider') },
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
);
