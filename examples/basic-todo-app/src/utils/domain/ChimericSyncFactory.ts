import { CreateChimericSyncFactory } from '@chimeric/react';
import { useAppSelector } from 'src/lib/store';
import { appStore } from 'src/core/global/appStore';

// Create a ChimericSync factory bound to the Redux store
export const ChimericSyncFactory = CreateChimericSyncFactory({
  getState: () => appStore.getState(),
  useSelector: useAppSelector,
});
