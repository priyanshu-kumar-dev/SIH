import { userActions } from "./user-slice";
import { axiosInstance } from "../../utils/axios";

// =========================
// SIGNUP
// =========================


export const getSignup =
  (userData) => async (dispatch) => {
    try {
      dispatch(userActions.getSignupRequest());

      const { data } = await axiosInstance.post(
        "/auth/user/signup",
        userData
      );

      dispatch(userActions.getSignupDetails(data.data.user));
    } catch (error) {
      dispatch(
        userActions.getError(
          error.response?.data?.message ||
            error.message ||
            "Registration failed"
        )
      );
    }
  };


// =========================
// LOGIN
// =========================
export const getLogin = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getLoginRequest());

    const { data } = await axiosInstance.post(
      "/auth/user/login",
      user
    );

    dispatch(userActions.getLogindetails(data.user));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Login failed";

    dispatch(userActions.getError(message));
  }
};


// =========================
// CURRENT USER
// =========================
export const currentUser = () => async (dispatch) => {
  try {
    dispatch(userActions.getCurrentRequest());

    const { data } = await axiosInstance.get(
      "/auth/user/me"
    );

    dispatch(userActions.getCurrentUser(data.user));
  } catch {
    dispatch(userActions.getLogout());
  }
};


// =========================
// UPDATE USER
// =========================
export const updateUser = (updateUser) => async (dispatch) => {
  try {
    dispatch(userActions.getUpdateUserRequest());

    await axiosInstance.patch(
      "/auth/user/updateMe",
      updateUser
    );

    // Get updated user
    const { data } = await axiosInstance.get(
      "/auth/user/me"
    );

    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "User update failed";

    dispatch(userActions.getError(message));
  }
};


// =========================
// FORGOT PASSWORD
// =========================
export const forgotPassword = (email) => async (dispatch) => {
  try {
    await axiosInstance.post(
      "/auth/user/forgotPassword",
      { email }
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send reset email";

    dispatch(userActions.getError(message));
  }
};


// =========================
// RESET PASSWORD
// =========================
export const resetPassword = (passwordData, token) => async (dispatch) => {
  try {
    await axiosInstance.patch(
      `/auth/user/resetPassword/${token}`,
      passwordData
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Password reset failed";

    dispatch(userActions.getError(message));
  }
};


// =========================
// UPDATE PASSWORD
// =========================
export const updatePassword = (password) => async (dispatch) => {
  try {
    dispatch(userActions.getPasswordRequest());

    await axiosInstance.patch(
      "/auth/user/updateMyPassword",
      password
    );

    dispatch(userActions.getPasswordSuccess(true));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Password update failed";

    dispatch(userActions.getError(message));
  }
};


// =========================
// LOGOUT
// =========================
export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.get(
      "/auth/user/logout"
    );

    // Clear Redux user state
    dispatch(userActions.getLogout(null));
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Logout failed"; 

    dispatch(userActions.getError(message));
  }
};