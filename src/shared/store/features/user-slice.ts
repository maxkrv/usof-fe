import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '@/shared/types/interfaces';

import { RootState } from '../store';

interface UserState {
  user: User | null;
  prevAvatar: string | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  prevAvatar: null,
  isLoading: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.prevAvatar = state.user?.profilePicture ?? null;
    },
    clearUser(state) {
      state.user = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    changeAvatar: (state, action: PayloadAction<string>) => {
      if (!state.user) return;

      state.user.profilePicture = action.payload;
    },
    clearAvatar: (state) => {
      if (!state.user) return;

      state.user.profilePicture = state.prevAvatar;
    },
    setPrevAvatar: (state, action: PayloadAction<string | null>) => {
      state.prevAvatar = action.payload;
    }
  }
});

export const { setUser, clearUser, changeAvatar, clearAvatar, setLoading, setPrevAvatar } = userSlice.actions;
export const userReducer = userSlice.reducer;

export const isUserActiveSelector = (state: RootState) => state.user.user?.isActive;
export const isUserAuthenticatedSelector = (state: RootState) => state.user.user !== null;
