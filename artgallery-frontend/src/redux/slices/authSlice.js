import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",

  initialState: {
    token: token || null,
    role: localStorage.getItem("role"),
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;