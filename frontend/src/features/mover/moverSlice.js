import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMoverDashboard = createAsyncThunk('mover/dashboard', async () => {
  const data = await api.get('/mover/dashboard').then((r) => r.data);
  return data;
});

export const fetchMoverJobs = createAsyncThunk('mover/fetchJobs', async () => {
  const data = await api.get('/mover/jobs').then((r) => Array.isArray(r.data) ? r.data : r.data.jobs || []);
  return data;
});

export const updateMoverAvailability = createAsyncThunk(
  'mover/updateAvailability',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await api.patch('/mover/availability', payload).then((r) => r.data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Unable to update availability.');
    }
  }
);

const moverSlice = createSlice({
  name: 'mover',
  initialState: {
    dashboard: null,
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearMoverError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoverDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoverDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchMoverDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMoverJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
      })
      .addCase(updateMoverAvailability.fulfilled, (state, action) => {
        state.dashboard = state.dashboard || {};
        state.dashboard.user = action.payload.user;
      });
  },
});

export const { clearMoverError } = moverSlice.actions;
export default moverSlice.reducer;
