import authReducer from './../features/auth/authSlice';
import { apiSlice } from './apis/apiSlice';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {loadReduxState} from '../shared/functions/browserStorage'
export const store = configureStore({
  reducer: {
    auth:authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware().concat(apiSlice.middleware),
  preloadedState: loadReduxState(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
