import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { active: boolean } = {
  active: false
};

export const confettiSlice = createSlice({
  name: 'confetti',
  initialState,
  reducers: {
    activateConfetti: (state) => {
      state.active = true;
    },
    setConfetti: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload;
    }
  }
});

export const { activateConfetti, setConfetti } = confettiSlice.actions;
export const confettiReducer = confettiSlice.reducer;
