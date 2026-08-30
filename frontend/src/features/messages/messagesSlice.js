import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import messagesApi from '../../services/messagesApi';
import { normalizeError } from '../../services/api';

export const fetchMessages = createAsyncThunk('messages/fetchAll', async () => {
  const data = await messagesApi.list();
  return data;
});

export const sendMessage = createAsyncThunk('messages/send', async (payload, { rejectWithValue }) => {
  try {
    const data = await messagesApi.send(payload);
    return data;
  } catch (err) {
    return rejectWithValue(normalizeError(err));
  }
});

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    list: [],
    loading: false,
    error: null,
    sending: false,
    sendError: null,
  },
  reducers: {
    clearMessages(state) {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.list.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.payload?.message || 'Unable to send message.';
      });
  },
});

export const { clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
