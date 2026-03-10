import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  acceptConsumerRequestApi,
  getManagerConsumerRequestsByIdApi,
  rejectConsumerRequestApi,
} from "@/services/consumerRequestService";

const initialState = {
  requests: [],
  isLoading: false,
  error: null,
  acceptLoadingById: {},
  acceptErrorById: {},
  rejectLoadingById: {},
  rejectErrorById: {},
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

export const acceptConsumerRequest = createAsyncThunk(
  "consumerRequest/acceptConsumerRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await acceptConsumerRequestApi(requestId);
      const request = response?.data?.request || response?.request || null;

      if (!request) {
        return rejectWithValue("Request update response is invalid.");
      }

      return request;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to accept request."
      );
    }
  }
);

export const rejectConsumerRequest = createAsyncThunk(
  "consumerRequest/rejectConsumerRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await rejectConsumerRequestApi(requestId);
      const request = response?.data?.request || response?.request || null;

      if (!request) {
        return rejectWithValue("Request update response is invalid.");
      }

      return request;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to reject request."
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
      })
      .addCase(acceptConsumerRequest.pending, (state, action) => {
        const requestId = action.meta.arg;
        state.acceptLoadingById[requestId] = true;
        delete state.acceptErrorById[requestId];
      })
      .addCase(acceptConsumerRequest.fulfilled, (state, action) => {
        const updatedRequest = action.payload;
        const requestId = updatedRequest?.id || updatedRequest?._id;

        if (!requestId) {
          return;
        }

        state.acceptLoadingById[requestId] = false;
        delete state.acceptErrorById[requestId];

        const index = state.requests.findIndex((item) => {
          const id = item?.id || item?._id;
          return String(id) === String(requestId);
        });

        if (index >= 0) {
          state.requests[index] = {
            ...state.requests[index],
            status: updatedRequest.status || "accepted",
            reviewedAt: updatedRequest.reviewedAt || state.requests[index].reviewedAt,
          };
        }
      })
      .addCase(acceptConsumerRequest.rejected, (state, action) => {
        const requestId = action.meta.arg;
        state.acceptLoadingById[requestId] = false;
        state.acceptErrorById[requestId] = action.payload || "Failed to accept request.";
      })
      .addCase(rejectConsumerRequest.pending, (state, action) => {
        const requestId = action.meta.arg;
        state.rejectLoadingById[requestId] = true;
        delete state.rejectErrorById[requestId];
      })
      .addCase(rejectConsumerRequest.fulfilled, (state, action) => {
        const updatedRequest = action.payload;
        const requestId = updatedRequest?.id || updatedRequest?._id;

        if (!requestId) {
          return;
        }

        state.rejectLoadingById[requestId] = false;
        delete state.rejectErrorById[requestId];

        const index = state.requests.findIndex((item) => {
          const id = item?.id || item?._id;
          return String(id) === String(requestId);
        });

        if (index >= 0) {
          state.requests[index] = {
            ...state.requests[index],
            status: updatedRequest.status || "rejected",
            reviewedAt: updatedRequest.reviewedAt || state.requests[index].reviewedAt,
          };
        }
      })
      .addCase(rejectConsumerRequest.rejected, (state, action) => {
        const requestId = action.meta.arg;
        state.rejectLoadingById[requestId] = false;
        state.rejectErrorById[requestId] = action.payload || "Failed to reject request.";
      });
  },
});

export default consumerRequestSlice.reducer;
