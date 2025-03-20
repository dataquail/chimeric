import { ReactNode } from 'react';
import { getThemeWrapper } from 'src/__test__/getThemeWrapper';
import { ReduxTestWrapper } from './ReduxTestWrapper';
import { ReactQueryTestWrapper } from './ReactQueryTestWrapper';

export const getTestWrapper = () => {
  const { ThemeWrapper } = getThemeWrapper();

  return ({ children }: { children: ReactNode }) => (
    <ReduxTestWrapper>
      <ThemeWrapper>
        <ReactQueryTestWrapper>{children}</ReactQueryTestWrapper>
      </ThemeWrapper>
    </ReduxTestWrapper>
  );
};
