import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import inventoryReducer from '../features/inventory/inventorySlice';
import moverReducer from '../features/movers/moverSlice';
import quoteReducer from '../features/quotes/quoteSlice';
import bookingReducer from '../features/bookings/bookingSlice';
import notificationReducer from '../features/notifications/notificationSlice';
import messageReducer from '../features/messages/messageSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    movers: moverReducer,
    quotes: quoteReducer,
    bookings: bookingReducer,
    notifications: notificationReducer,
    messages: messageReducer,
    ui: uiReducer,
  },
});
