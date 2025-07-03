import { configureStore } from '@reduxjs/toolkit';
import mindMapReducer from './mindMapSlice';

export const store = configureStore({
  reducer: {
    mindmap: mindMapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
