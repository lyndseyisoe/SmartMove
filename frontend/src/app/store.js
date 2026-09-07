import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import quoteReducer from '../features/quotes/quoteSlice';
import bookingReducer from '../features/bookings/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quotes: quoteReducer,
    bookings: bookingReducer,
  },
});
