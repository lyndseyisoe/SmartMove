import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingApi from '../../services/bookingApi';
import { normalizeError } from '../../services/api';

export const fetchBookings = createAsyncThunk('bookings/fetchAll', async (params) => {
  return await bookingApi.list(params);
});

export const fetchBookingById = createAsyncThunk('bookings/fetchById', async (id) => {
  return await bookingApi.getById(id);
});

export const createBooking = createAsyncThunk('bookings/create', async (payload, { rejectWithValue }) => {
  try {
    return await bookingApi.create(payload);
  } catch (err) {
    return rejectWithValue(normalizeError(err));
  }
});

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }) => {
    const data = await bookingApi.updateStatus(id, status);
    return data || { id, status };
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
    creating: false,
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.list.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload?.message || 'Unable to create this booking.';
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
        if (state.selected?.id === action.payload.id) {
          state.selected = { ...state.selected, ...action.payload };
        }
      });
  },
});

export default bookingSlice.reducer;
