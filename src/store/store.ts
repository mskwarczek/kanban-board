import { configureStore } from '@reduxjs/toolkit';

import { loadState } from './localStorage.ts'
import { boardSlice } from './slices';

export const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
  },
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;