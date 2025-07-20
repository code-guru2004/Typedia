// redux/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: '',
  email: '',
  uid: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, email, uid } = action.payload;
      state.username = username;
      state.email = email;
      state.uid = uid;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.username = '';
      state.email = '';
      state.uid = '';
      state.isLoggedIn = false;
    },
  },
});

// ✅ Correct way to export the actions and reducer:
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
