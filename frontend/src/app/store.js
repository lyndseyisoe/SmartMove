import { configureStore } from '@reduxjs/toolkit';
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

export const store = configureStore({
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
});
