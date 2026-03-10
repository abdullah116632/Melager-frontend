import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { searchManagersApi } from "@/services/managerService";

const initialState = {
  query: "",
  searchBy: "nameOfMess",
  isSearching: false,
  searchError: null,
  searchResults: [],
  hasSearched: false,
};

export const searchManagers = createAsyncThunk(
  "managerSearch/searchManagers",
  async ({ query, searchBy, fallbackErrorMessage }, { rejectWithValue }) => {
    try {
      const response = await searchManagersApi({ [searchBy]: query });
      const managers =
        response?.data?.managers ||
        response?.data?.results ||
        response?.data ||
        response?.managers ||
        response?.results ||
        [];

      return Array.isArray(managers) ? managers : [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || fallbackErrorMessage || "Search failed."
      );
    }
  }
);

const managerSearchSlice = createSlice({
  name: "managerSearch",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
      state.searchError = null;
    },
    setSearchBy: (state, action) => {
      state.searchBy = action.payload;
    },
    clearSearchResult: (state) => {
      state.hasSearched = false;
      state.searchResults = [];
      state.searchError = null;
      state.isSearching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchManagers.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
        state.hasSearched = true;
      })
      .addCase(searchManagers.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchManagers.rejected, (state, action) => {
        state.isSearching = false;
        state.searchResults = [];
        state.searchError = action.payload || "Search failed.";
      });
  },
});

export const { setSearchQuery, setSearchBy, clearSearchResult } = managerSearchSlice.actions;

export default managerSearchSlice.reducer;
