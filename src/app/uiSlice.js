import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mobileSidebarOpen: false,
  },
  reducers: {
    setMobileSidebarOpen(state, action) {
      state.mobileSidebarOpen = action.payload;
    },
  },
});

export const { setMobileSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
