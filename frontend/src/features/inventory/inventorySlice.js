import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import inventoryApi from '../../services/inventoryApi';
import { normalizeError } from '../../services/api';

export const fetchInventory = createAsyncThunk('inventory/fetchAll', async () => {
  const data = await inventoryApi.list();
  return data;
});

export const addInventoryItem = createAsyncThunk('inventory/add', async (payload, { rejectWithValue }) => {
  try {
    const data = await inventoryApi.create(payload);
    return data;
  } catch (err) {
    return rejectWithValue(normalizeError(err));
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    list: [],
    loading: false,
    error: null,
    adding: false,
    addError: null,
  },
  reducers: {
    clearInventory(state) {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addInventoryItem.pending, (state) => {
        state.adding = true;
        state.addError = null;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.adding = false;
        state.list.unshift(action.payload);
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.adding = false;
        state.addError = action.payload?.message || 'Unable to add item.';
      });
  },
});

export const { clearInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
