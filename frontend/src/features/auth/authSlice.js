import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../services/authApi';
import { normalizeError, setAuthToken } from '../../services/api';

// The backend issues a JWT in the response body (no cookie) and has no
// refresh-token endpoint yet, so this is the only way a session survives a
// page reload right now. sessionStorage (not localStorage) so it's at least
// cleared when the tab closes. This is a real trade-off — anything running
// on the page can read it — and should be revisited once the backend adds
// either an HTTP-only cookie or a refresh-token flow.
const TOKEN_STORAGE_KEY = 'smartmove:token';

function persistToken(token) {
  setAuthToken(token);
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

const initialState = {
  user: null, // { id, name, email, role }
  isAuthenticated: false,
  loading: true, // true until the initial /auth/me probe resolves
  authError: null, // error from the last login/register attempt
};

const VALID_ROLES = ['client', 'mover', 'admin'];

/**
 * Guards against a "successful" response that isn't actually a valid user —
 * e.g. VITE_API_URL pointing nowhere real and a dev server SPA-fallback
 * (or any other proxy/misconfiguration) returning 200 with the wrong body.
 * A 200 status alone should never be enough to consider someone signed in.
 */
function assertValidUser(data) {
  const user = data?.user;
  if (!user || typeof user !== 'object' || !user.id || !VALID_ROLES.includes(user.role)) {
    throw new Error(
      "Received an unexpected response from /auth/me — check that VITE_API_URL points at your Flask API and that it's running."
    );
  }
  return user;
}

export const fetchCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
  if (!storedToken) {
    // No token to probe with — skip the network round trip and go straight
    // to "signed out" instead of firing a request that's guaranteed to 401.
    return rejectWithValue(null);
  }
  setAuthToken(storedToken);
  try {
    const data = await authApi.me();
    return assertValidUser(data);
  } catch (err) {
    persistToken(null);
    return rejectWithValue(normalizeError(err));
  }
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const loginData = await authApi.login(payload);
    if (!loginData?.access_token) {
      throw new Error('Login succeeded but no access token was returned.');
    }
    persistToken(loginData.access_token);
    const data = await authApi.me();
    return assertValidUser(data);
  } catch (err) {
    persistToken(null);
    return rejectWithValue(normalizeError(err));
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    // The backend's /auth/register doesn't issue a token — it only creates
    // the account — so to keep the "no separate login step" UX from the
    // workflow spec, we log in right after with the same credentials.
    await authApi.register(payload);
    const loginData = await authApi.login({ email: payload.email, password: payload.password });
    if (!loginData?.access_token) {
      throw new Error('Registration succeeded but logging in afterward failed.');
    }
    persistToken(loginData.access_token);
    const data = await authApi.me();
    return assertValidUser(data);
  } catch (err) {
    persistToken(null);
    return rejectWithValue(normalizeError(err));
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  // Stateless JWT, no logout endpoint on the backend yet — "logging out" is
  // just discarding the token on our end.
  persistToken(null);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.authError = null;
    },
    forceLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      persistToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.authError = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authError = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.authError = action.payload?.message || 'Unable to log in.';
      })
      .addCase(register.pending, (state) => {
        state.authError = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authError = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.authError = action.payload?.message || 'Unable to create your account.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, forceLogout } = authSlice.actions;
export default authSlice.reducer;
