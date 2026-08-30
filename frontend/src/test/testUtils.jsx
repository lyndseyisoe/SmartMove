import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import authReducer from '../features/auth/authSlice';
import quoteReducer from '../features/quotes/quoteSlice';
import bookingReducer from '../features/bookings/bookingSlice';
import profileReducer from '../features/profile/profileSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import messagesReducer from '../features/messages/messagesSlice';
import moverReducer from '../features/mover/moverSlice';
import adminReducer from '../features/admin/adminSlice';
import moversReducer from '../features/movers/moversSlice';

export function createTestStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      quotes: quoteReducer,
      bookings: bookingReducer,
      profile: profileReducer,
      notifications: notificationsReducer,
      reviews: reviewsReducer,
      inventory: inventoryReducer,
      messages: messagesReducer,
      mover: moverReducer,
      admin: adminReducer,
      movers: moversReducer,
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
