import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, logoutApi, meApi, registerApi } from "@/services/authApi";

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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      const token = response?.token || response?.accessToken;
      const user = response?.user || null;

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
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Registration failed."
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await meApi();
      return response?.user || response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch user profile."
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
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logoutLocal: (state) => {
      clearToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed.";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed.";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "User session expired.";
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
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || null;
      });
  },
});

export const { clearAuthError, logoutLocal } = authSlice.actions;
export default authSlice.reducer;
