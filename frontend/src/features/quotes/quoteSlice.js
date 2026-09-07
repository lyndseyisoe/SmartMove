import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quoteApi from '../../services/quoteApi';
import { normalizeError } from '../../services/api';

export const estimateQuote = createAsyncThunk('quotes/estimate', async (payload, { rejectWithValue }) => {
  try {
    const data = await quoteApi.estimate(payload);
    return data;
  } catch (err) {
    return rejectWithValue(normalizeError(err));
  }
});

const quoteSlice = createSlice({
  name: 'quotes',
  initialState: {
    lastRequest: null,
    estimate: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearQuote(state) {
      state.estimate = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(estimateQuote.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastRequest = action.meta.arg;
      })
      .addCase(estimateQuote.fulfilled, (state, action) => {
        state.estimate = action.payload;
        state.loading = false;
      })
      .addCase(estimateQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Unable to calculate a quote.';
      });
  },
});

export const { clearQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
