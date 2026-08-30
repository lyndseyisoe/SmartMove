import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationsApi from '../../services/notificationsApi';
import { normalizeError } from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async () => {
  const data = await notificationsApi.list();
  return data;
});

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    const data = await notificationsApi.markRead(id);
    return data;
  } catch (err) {
    return rejectWithValue(normalizeError(err));
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearNotifications(state) {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.list.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
