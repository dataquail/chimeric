import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  useDispatch,
  TypedUseSelectorHook,
  useSelector,
  useStore,
} from 'react-redux';
import { todoReducer } from './features/todo';

const rootReducer = combineReducers({
  todo: todoReducer,
});

export const makeStore = (initialState?: InitialState) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
    preloadedState: initialState,
  });

  return store;
};

export type InitialState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
