import { configureStore } from '@reduxjs/toolkit';

import { confettiReducer } from './features/confetti-slice';
import { userReducer } from './features/user-slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    confetti: confettiReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
