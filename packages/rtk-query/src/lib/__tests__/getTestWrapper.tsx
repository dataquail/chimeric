import { EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

export const getTestWrapper =
  (store: EnhancedStore) =>
  ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
