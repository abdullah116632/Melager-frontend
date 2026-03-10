import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getManagerConsumerRequestsByIdApi } from "@/services/consumerRequestService";

const initialState = {
  requests: [],
  isLoading: false,
  error: null,
};

function decodeManagerIdFromToken(token) {
  if (!token || typeof atob !== "function") {
    return null;
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));

    return decoded?.id || decoded?._id || decoded?.managerId || decoded?.sub || null;
  } catch {
    return null;
  }
}

export const fetchManagerConsumerRequests = createAsyncThunk(
  "consumerRequest/fetchManagerConsumerRequests",
  async (_, { getState, rejectWithValue }) => {
    try {
      const authState = getState().auth || {};
      const managerId =
        authState?.user?.id || authState?.user?._id || decodeManagerIdFromToken(authState?.token);

      if (!managerId) {
        return rejectWithValue("Manager ID not found. Please login again.");
      }

      const response = await getManagerConsumerRequestsByIdApi(managerId);
      const requests = response?.data?.requests || response?.requests || [];

      return Array.isArray(requests) ? requests : [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load consumer requests."
      );
    }
  }
);

const consumerRequestSlice = createSlice({
  name: "consumerRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagerConsumerRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchManagerConsumerRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
        state.error = null;
      })
      .addCase(fetchManagerConsumerRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.requests = [];
        state.error = action.payload || "Failed to load consumer requests.";
      });
  },
});

export default consumerRequestSlice.reducer;
