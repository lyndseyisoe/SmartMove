import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileApi from '../../services/profileApi';
import { normalizeError } from '../../services/api';

export const fetchProfile = createAsyncThunk('profile/fetch', async () => {
  const data = await profileApi.get();
  return data;
});

export const updateProfile = createAsyncThunk('profile/update', async (payload, { rejectWithValue }) => {
  try {
    const data = await profileApi.update(payload);
    return data;
  } catch (err) {
    return rejectWithValue(normalizeError(err));
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    loading: false,
    error: null,
    updating: false,
  },
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || 'Unable to update profile.';
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
