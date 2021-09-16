import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import * as usersService from '../../services/UsersService';

const initialState = {
  data: null,
  isLoading: false,
  isLogged: false,
};

const tokenLogin = createAsyncThunk('user/tokenLogin', async () => await usersService.auth(), {
  condition: (_, { getState }) => !getState().user.isLoading,
});
const login = createAsyncThunk('user/login', async (code) => await usersService.login(code));
const logout = createAsyncThunk('user/logout', async () => await usersService.logout(), {
  condition: (_, { getState }) => !getState().user.isLoading,
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.data = null;
      state.isLogged = false;
    });

    builder.addMatcher(isAnyOf(tokenLogin.fulfilled, login.fulfilled), (state, action) => {
      state.data = action.payload;
      state.isLogged = true;
    });

    builder.addMatcher(isAnyOf(tokenLogin.pending, login.pending), (state) => {
      state.isLoading = true;
    });

    builder.addMatcher(isAnyOf(tokenLogin.fulfilled, login.fulfilled, tokenLogin.rejected, login.rejected), (state) => {
      state.isLoading = false;
    });
  },
});

export { login, tokenLogin, logout };
export default userSlice.reducer;
