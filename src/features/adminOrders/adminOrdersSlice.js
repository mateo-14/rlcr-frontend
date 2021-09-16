import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { adminGetAllOrders, adminUpdateOrder } from '../../services/OrdersService';

const initialState = {
  isFetching: false,
  orders: null,
};

const fetchOrders = createAsyncThunk(
  'adminOrders/fetchOrders',
  async (data, { rejectWithValue }) => {
    try {
      const orders = await adminGetAllOrders(data.query, data.cancelToken);
      return orders;
    } catch (err) {
      if (axios.isCancel(err)) {
        return rejectWithValue({ isAxiosCancel: true });
      } else return rejectWithValue(err);
    }
  },
  { condition: (_, { getState }) => !getState().adminOrders.isFetching }
);

const updateOrder = createAsyncThunk(
  'adminOrders/updateOrder',
  async (data) => await adminUpdateOrder(data.id, data.data),
  {
    condition: (_, { getState }) => !getState().adminOrders.isFetching,
  }
);

export const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {
    clear: (state) => {
      state.orders = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });

    builder.addCase(updateOrder.fulfilled, (state, action) => {
      state.orders = state.orders?.map((order) => (order.id === action.payload.id ? action.payload : order));
    });

    builder.addMatcher(isAnyOf(fetchOrders.pending, updateOrder.pending), (state) => {
      state.isFetching = true;
    });

    builder.addMatcher(
      isAnyOf(fetchOrders.fulfilled, fetchOrders.rejected, updateOrder.fulfilled, updateOrder.rejected),
      (state) => {
        state.isFetching = false;
      }
    );
  },
});

export { fetchOrders, updateOrder };
export const { clear } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
