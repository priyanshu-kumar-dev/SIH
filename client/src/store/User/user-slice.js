import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",

  initialState: {
    isAuthenticated: false,
    loading: false,
    user: null,
    errors: null,
    success: false,
  },

  reducers: {

    getSignupRequest(state) {
      state.loading = true;
      state.errors = null;
    },

    getSignupDetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.success = true;
      state.errors = null;
    },

    getLoginRequest(state) {
      state.loading = true;
      state.errors = null;
    },

    getLogindetails(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.success = true;
      state.errors = null;
    },

    getError(state, action) {
      state.errors = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
      state.success = false;
    },

    getCurrentRequest(state) {
      state.loading = true;
    },

    getCurrentUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },

    getUpdateUserRequest(state) {
      state.loading = true;
    },

    getLogoutRequest(state) {
      state.loading = true;
    },

    getLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },

    getPasswordRequest(state) {
      state.loading = true;
      state.errors = null;
    },

    getPasswordSuccess(state, action) {
      state.success = action.payload;
      state.loading = false;
      state.errors = null;
    },

    clearErrors(state) {
      state.errors = null;
    },

    clearSuccess(state) {
      state.success = false;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;