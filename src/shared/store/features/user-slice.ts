import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/shared/types/interfaces';

const initialState: { user: User | null; isLoading: boolean } = {
  user: null,
  isLoading: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      return {
        ...state,
        user: action.payload
      };
    },
    clearUser(state) {
      state.user = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export const userReducer = userSlice.reducer;
