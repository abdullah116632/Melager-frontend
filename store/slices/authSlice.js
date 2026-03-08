import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginApi,
  logoutApi,
  registerApi,
  resendRegistrationOtpApi,
  verifyRegistrationOtpApi,
} from "@/services/authApi";

function readToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
}

function saveToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
}

function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
}

function extractToken(response) {
  return (
    response?.data?.data?.token ||
    response?.data?.token ||
    response?.token ||
    response?.accessToken ||
    null
  );
}

function extractManager(response) {
  return (
    response?.data?.data?.manager ||
    response?.data?.manager ||
    response?.data?.user ||
    response?.manager ||
    response?.user ||
    null
  );
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      const token = extractToken(response);
      const user = extractManager(response);

      if (token) {
        saveToken(token);
      }

      return { token: token || null, user };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Login failed."
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerApi(payload);
      const token = extractToken(response);
      const manager = extractManager(response);

      if (token) {
        saveToken(token);
      }

      return {
        message: response?.message || "Registration successful. Please verify your OTP.",
        email: manager?.email || payload?.email || "",
        manager,
        token,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Registration failed."
      );
    }
  }
);

export const verifyRegistrationOtp = createAsyncThunk(
  "auth/verifyRegistrationOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifyRegistrationOtpApi(payload);
      const token = extractToken(response);
      const user = extractManager(response);

      if (token) {
        saveToken(token);
      }

      return {
        token,
        user,
        message: response?.message || "Manager verified successfully",
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "OTP verification failed."
      );
    }
  }
);

export const resendRegistrationOtp = createAsyncThunk(
  "auth/resendRegistrationOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await resendRegistrationOtpApi(payload);
      return {
        message: response?.message || "OTP sent successfully.",
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to resend OTP."
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      clearToken();
      return true;
    } catch (error) {
      clearToken();
      return rejectWithValue(
        error?.response?.data?.message || "Logout request failed."
      );
    }
  }
);

const initialState = {
  user: null,
  token: readToken(),
  isAuthenticated: !!readToken(),
  isLoading: false,
  error: null,
  pendingVerificationEmail: null,
  registrationMessage: null,
  verifySuccessMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthStatus: (state) => {
      state.error = null;
      state.registrationMessage = null;
      state.verifySuccessMessage = null;
    },
    logoutLocal: (state) => {
      clearToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.pendingVerificationEmail = null;
      state.registrationMessage = null;
      state.verifySuccessMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verifySuccessMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed.";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationMessage = null;
        state.verifySuccessMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingVerificationEmail = action.payload.email || null;
        state.registrationMessage = action.payload.message || null;
        state.token = action.payload.token || null;
        state.user = action.payload.manager || null;
        state.isAuthenticated = !!action.payload.token;
        state.error = null;

        if (action.payload.token) {
          state.pendingVerificationEmail = null;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed.";
      })
      .addCase(verifyRegistrationOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.verifySuccessMessage = null;
      })
      .addCase(verifyRegistrationOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
        state.pendingVerificationEmail = null;
        state.verifySuccessMessage = action.payload.message || null;
      })
      .addCase(verifyRegistrationOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "OTP verification failed.";
      })
      .addCase(resendRegistrationOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendRegistrationOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationMessage = action.payload.message || "OTP sent successfully.";
      })
      .addCase(resendRegistrationOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to resend OTP.";
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.pendingVerificationEmail = null;
        state.registrationMessage = null;
        state.verifySuccessMessage = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || null;
        state.pendingVerificationEmail = null;
        state.registrationMessage = null;
        state.verifySuccessMessage = null;
      });
  },
});

export const { clearAuthError, clearAuthStatus, logoutLocal } = authSlice.actions;
export default authSlice.reducer;
