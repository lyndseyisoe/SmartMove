import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import authReducer from '../features/auth/authSlice';
import quoteReducer from '../features/quotes/quoteSlice';
import bookingReducer from '../features/bookings/bookingSlice';

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      quotes: quoteReducer,
      bookings: bookingReducer,
    },
    preloadedState,
  });
}

export function renderWithProviders(ui, { preloadedState, route = '/', store = createTestStore(preloadedState) } = {}) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper }) };
}
