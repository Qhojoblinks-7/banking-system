// uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // default theme is light mode
  // You could extend this state to include other UI preferences as needed
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      // action.payload should be either "light" or "dark"
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
