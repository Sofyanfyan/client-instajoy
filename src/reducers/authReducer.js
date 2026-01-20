import { createSlice } from "@reduxjs/toolkit";
import { login } from "../services/authService";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("instaapp_user");
      localStorage.removeItem("api_token");
    },
    setUserFromStorage: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const { user, token } = action.payload.data;
        
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.error = null;

        // Store user data in localStorage with key "instaapp_user"
        localStorage.setItem("instaapp_user", JSON.stringify(user));
        // Store token in localStorage with key "api_token"
        localStorage.setItem("api_token", token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Login failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
