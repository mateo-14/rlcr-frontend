import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import adminOrdersReducer from './features/adminOrders/adminOrdersSlice';
import adminUsersReducer from './features/adminUsers/adminUsersSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    adminOrders: adminOrdersReducer,
    adminUsers: adminUsersReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
