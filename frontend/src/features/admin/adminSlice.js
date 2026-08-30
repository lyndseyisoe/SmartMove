import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminApi from '../../services/adminApi';

export const fetchAdminReports = createAsyncThunk('admin/fetchReports', async () => {
  const data = await adminApi.getReports();
  return data;
});

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const data = await adminApi.getUsers();
  return data;
});

export const fetchAdminMovers = createAsyncThunk('admin/fetchMovers', async () => {
  const data = await adminApi.getMovers();
  return data;
});

export const approveMover = createAsyncThunk('admin/approveMover', async (id, { rejectWithValue }) => {
  try {
    const data = await adminApi.approveMover(id);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Unable to approve mover.');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    reports: null,
    users: [],
    movers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchAdminReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAdminMovers.fulfilled, (state, action) => {
        state.movers = action.payload;
      })
      .addCase(approveMover.fulfilled, (state, action) => {
        const idx = state.movers.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.movers[idx] = { ...state.movers[idx], ...action.payload };
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
