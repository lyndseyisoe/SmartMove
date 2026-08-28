import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/testUtils';
import Login from '../pages/Login';
import authApi from '../../../services/authApi';

vi.mock('../../../services/authApi');

const TOKEN_KEY = 'smartmove:token';

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('shows validation errors for empty submission', async () => {
    renderWithProviders(<Login />, { route: '/login' });
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('logs in successfully, captures the bearer token, and stores the user', async () => {
    // Matches the real backend: /auth/login returns the token in the body,
    // not a cookie — see services/api.js.
    authApi.login.mockResolvedValue({ access_token: 'fake-jwt', user: { id: 1 } });
    authApi.me.mockResolvedValue({ user: { id: 1, name: 'Jane', email: 'jane@example.com', role: 'client' } });

    const { store } = renderWithProviders(<Login />, { route: '/login' });

    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
    expect(store.getState().auth.user.role).toBe('client');
    expect(sessionStorage.getItem(TOKEN_KEY)).toBe('fake-jwt');
  });

  it('does not authenticate if the login response has no access_token', async () => {
    authApi.login.mockResolvedValue({ user: { id: 1 } }); // malformed / unexpected shape

    const { store } = renderWithProviders(<Login />, { route: '/login' });

    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(store.getState().auth.authError).toBeTruthy();
    });
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('surfaces a server error on failed login', async () => {
    authApi.login.mockRejectedValue({
      response: { status: 401, data: { message: 'Invalid email or password.' } },
    });

    renderWithProviders(<Login />, { route: '/login' });

    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'wrongpass');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });
});

describe('fetchCurrentUser response validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('skips the network call and stays signed out when there is no stored token', async () => {
    const { store } = renderWithProviders(<div />, { route: '/' });
    const { fetchCurrentUser } = await import('../authSlice');
    await store.dispatch(fetchCurrentUser());
    expect(authApi.me).not.toHaveBeenCalled();
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('does not authenticate when /auth/me returns a malformed body (e.g. an HTML fallback page)', async () => {
    sessionStorage.setItem(TOKEN_KEY, 'stale-token');
    const { store } = renderWithProviders(<div />, { route: '/' });
    authApi.me.mockResolvedValue('<!doctype html>...'); // what a misconfigured proxy/dev-fallback would return
    const { fetchCurrentUser } = await import('../authSlice');
    await store.dispatch(fetchCurrentUser());
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });

  it('does not authenticate when the user object is missing a valid role', async () => {
    sessionStorage.setItem(TOKEN_KEY, 'stale-token');
    const { store } = renderWithProviders(<div />, { route: '/' });
    authApi.me.mockResolvedValue({ user: { id: '1', name: 'Jane' } }); // no role field
    const { fetchCurrentUser } = await import('../authSlice');
    await store.dispatch(fetchCurrentUser());
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});
