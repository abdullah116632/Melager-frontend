import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyMessesApi } from "@/services/messMemberService";

const initialState = {
  messes: [],
  isLoading: false,
  error: "",
};

export const fetchMyMesses = createAsyncThunk(
  "messMember/fetchMyMesses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyMessesApi();
      const messes = response?.data?.messes || response?.messes || [];
      return Array.isArray(messes) ? messes : [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load member messes."
      );
    }
  }
);

const messMemberSlice = createSlice({
  name: "messMember",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyMesses.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchMyMesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.messes = action.payload;
      })
      .addCase(fetchMyMesses.rejected, (state, action) => {
        state.isLoading = false;
        state.messes = [];
        state.error = action.payload || "Failed to load member messes.";
      });
  },
});

export default messMemberSlice.reducer;
