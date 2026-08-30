import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moversApi from '../../services/moversApi';

export const fetchMovers = createAsyncThunk('movers/fetchAll', async () => {
  const data = await moversApi.list();
  return data;
});

const moversSlice = createSlice({
  name: 'movers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMovers(state) {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMovers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearMovers } = moversSlice.actions;
export default moversSlice.reducer;
