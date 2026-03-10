import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConsumerRequestByIdsApi, loadConsumerSessionApi } from "@/services/consumerService";

const CONSUMER_SESSION_STORAGE_KEY = "consumerSessionData";

function readConsumerSessionFlag() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(localStorage.getItem(CONSUMER_SESSION_STORAGE_KEY));
}

export const submitConsumerAccess = createAsyncThunk(
  "consumer/submitConsumerAccess",
  async (
    {
      identifier,
      requiredIdentifierMessage,
      invalidMessSelectionMessage,
      requestNotAcceptedMessage,
      accessFailedMessage,
    },
    { getState, rejectWithValue }
  ) => {
    const drawerState = getState().drawer;
    const value = (identifier || "").trim();
    const managerId = drawerState.accessTargetManagerId;

    if (!value) {
      return rejectWithValue(requiredIdentifierMessage || "Identifier is required.");
    }

    if (!managerId) {
      return rejectWithValue(invalidMessSelectionMessage || "Invalid mess selected.");
    }

    const payload = value.includes("@") ? { email: value } : { phnNumber: value };

    try {
      const sessionResponse = await loadConsumerSessionApi(payload);
      const consumer = sessionResponse?.data?.consumer || null;

      if (typeof window !== "undefined") {
        localStorage.setItem(CONSUMER_SESSION_STORAGE_KEY, JSON.stringify({ consumer }));
      }

      const consumerId = consumer?.id || consumer?._id;

      if (!consumerId) {
        return rejectWithValue(accessFailedMessage || "Access failed.");
      }

      const requestResponse = await getConsumerRequestByIdsApi({
        consumerId,
        managerId,
      });
      const request = requestResponse?.data?.request || requestResponse?.request || null;
      const status = (request?.status || "").toLowerCase();

      if (!request) {
        return rejectWithValue("Consumer request not found.");
      }

      if (status !== "accepted") {
        return rejectWithValue(requestNotAcceptedMessage || "Your request is not accepted yet.");
      }

      return { managerId };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          accessFailedMessage ||
          "Access failed."
      );
    }
  }
);

const initialState = {
  hasConsumerSession: readConsumerSessionFlag(),
  accessError: "",
  isAccessSubmitting: false,
};

const consumerSlice = createSlice({
  name: "consumer",
  initialState,
  reducers: {
    syncConsumerSessionFromStorage: (state) => {
      state.hasConsumerSession = readConsumerSessionFlag();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitConsumerAccess.pending, (state) => {
        state.isAccessSubmitting = true;
        state.accessError = "";
      })
      .addCase(submitConsumerAccess.fulfilled, (state) => {
        state.isAccessSubmitting = false;
        state.hasConsumerSession = true;
        state.accessError = "";
      })
      .addCase(submitConsumerAccess.rejected, (state, action) => {
        state.isAccessSubmitting = false;
        state.accessError = action.payload || "Access failed.";
      });
  },
});

export const { syncConsumerSessionFromStorage } = consumerSlice.actions;

export default consumerSlice.reducer;
