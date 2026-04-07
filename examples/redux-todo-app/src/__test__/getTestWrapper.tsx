import { ReactNode, JSX } from 'react';
import { getThemeWrapper } from 'src/__test__/getThemeWrapper';
import { ReduxTestWrapper } from './ReduxTestWrapper';

export const getTestWrapper = (): (({
  children,
}: {
  children: ReactNode;
}) => JSX.Element) => {
  const { ThemeWrapper } = getThemeWrapper();

  return ({ children }: { children: ReactNode }) => (
    <ReduxTestWrapper>
      <ThemeWrapper>{children}</ThemeWrapper>
    </ReduxTestWrapper>
  );
};
