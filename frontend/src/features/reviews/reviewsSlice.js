import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewsApi from '../../services/reviewsApi';
import { normalizeError } from '../../services/api';

export const fetchReviews = createAsyncThunk('reviews/fetchAll', async (params) => {
  const data = await reviewsApi.list(params);
  return data;
});

export const createReview = createAsyncThunk('reviews/create', async (payload, { rejectWithValue }) => {
  try {
    const data = await reviewsApi.create(payload);
    return data;
  } catch (err) {
    return rejectWithValue(normalizeError(err));
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    list: [],
    loading: false,
    error: null,
    creating: false,
    createError: null,
  },
  reducers: {
    clearReviews(state) {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createReview.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.creating = false;
        state.list.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload?.message || 'Unable to submit review.';
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
