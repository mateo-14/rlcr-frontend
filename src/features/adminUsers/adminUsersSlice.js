import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { adminGetAllUsers } from '../../services/UsersService';

const initialState = {
  isFetching: false,
  users: null,
};

const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async (cancelToken, { rejectWithValue }) => {
    try {
      const orders = await adminGetAllUsers(cancelToken);
      return orders;
    } catch (err) {
      if (axios.isCancel(err)) {
        return rejectWithValue({ isAxiosCancel: true });
      } else return rejectWithValue(err);
    }
  },
  { condition: (_, { getState }) => !getState().adminUsers.isFetching }
);

export const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });

    builder.addCase(fetchUsers.pending, (state) => {
      state.isFetching = true;
    });

    builder.addMatcher(isAnyOf(fetchUsers.fulfilled, fetchUsers.rejected), (state) => {
      state.isFetching = false;
    });
  },
});

export { fetchUsers };
export default adminUsersSlice.reducer;
