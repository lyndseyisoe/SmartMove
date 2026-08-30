import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/testUtils';
import Register from '../pages/Register';
import authApi from '../../../services/authApi';

vi.mock('../../../services/authApi');

describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('registers, then logs in automatically since /auth/register issues no token', async () => {
    authApi.register.mockResolvedValue({ message: 'User registered successfully', user: { id: 1 } });
    authApi.login.mockResolvedValue({ access_token: 'fake-jwt', user: { id: 1 } });
    authApi.me.mockResolvedValue({
      user: { id: 1, name: 'Jane Wanjiru', email: 'jane@example.com', role: 'client' },
    });

    const { store } = renderWithProviders(<Register />, { route: '/register' });

    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Wanjiru');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.selectOptions(screen.getByLabelText(/role/i), 'client');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
    expect(authApi.register).toHaveBeenCalledOnce();
    expect(authApi.register).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Jane Wanjiru', email: 'jane@example.com', password: 'password123', role: 'client' })
    );
    expect(authApi.login).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'jane@example.com', password: 'password123' })
    );
    expect(sessionStorage.getItem('smartmove:token')).toBe('fake-jwt');
  });

  it('surfaces an error if registration succeeds but the follow-up login fails', async () => {
    authApi.register.mockResolvedValue({ user: { id: 1 } });
    authApi.login.mockRejectedValue({ response: { status: 401, data: { error: 'Invalid email or password' } } });

    const { store } = renderWithProviders(<Register />, { route: '/register' });

    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Wanjiru');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    await userEvent.selectOptions(screen.getByLabelText(/role/i), 'client');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(store.getState().auth.authError).toBeTruthy();
    });
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('shows a field error when passwords do not match', async () => {
    renderWithProviders(<Register />, { route: '/register' });

    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Wanjiru');
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(screen.getByLabelText(/^password/i), 'password123');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different123');
    await userEvent.selectOptions(screen.getByLabelText(/role/i), 'client');
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/passwords don't match/i)).toBeInTheDocument();
    expect(authApi.register).not.toHaveBeenCalled();
  });
});
