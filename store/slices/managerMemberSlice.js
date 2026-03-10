import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyMessesApi } from "@/services/messMemberService";
import { addMemberToManagerApi, getManagerMembersByIdApi } from "@/services/managerService";

const initialState = {
  managers: [],
  isLoading: false,
  error: "",
  members: [],
  membersLoading: false,
  membersError: null,
  addMemberLoading: false,
  addMemberError: null,
  addMemberSuccess: null,
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

export const fetchManagerMembers = createAsyncThunk(
  "messMember/fetchManagerMembers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const authState = getState().auth || {};
      const managerId =
        authState?.user?.id || authState?.user?._id || decodeManagerIdFromToken(authState?.token);

      if (!managerId) {
        return rejectWithValue("Manager ID not found. Please login again.");
      }

      const response = await getManagerMembersByIdApi(managerId);
      const members = response?.data?.members || response?.members || [];

      return Array.isArray(members) ? members : [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load members."
      );
    }
  }
);

export const addManagerMember = createAsyncThunk(
  "messMember/addManagerMember",
  async ({ name, email, phnNumber }, { rejectWithValue }) => {
    try {
      const response = await addMemberToManagerApi({ name, email, phnNumber });
      const consumer = response?.data?.consumer || response?.consumer || null;
      const membership = response?.data?.membership || response?.membership || null;

      return {
        member: {
          id: membership?.id || membership?._id || consumer?.id || consumer?._id,
          consumer,
          joinedAt: membership?.joinedAt || null,
          isActive: membership?.isActive ?? true,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to add member."
      );
    }
  }
);

const managerMemberSlice = createSlice({
  name: "messMember",
  initialState,
  reducers: {
    clearAddMemberStatus: (state) => {
      state.addMemberError = null;
      state.addMemberSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyMesses.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchMyMesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = "";
        state.managers = action.payload;
      })
      .addCase(fetchMyMesses.rejected, (state, action) => {
        state.isLoading = false;
        state.managers = [];
        state.error = action.payload || "Failed to load member messes.";
      })
      .addCase(fetchManagerMembers.pending, (state) => {
        state.membersLoading = true;
        state.membersError = null;
      })
      .addCase(fetchManagerMembers.fulfilled, (state, action) => {
        state.membersLoading = false;
        state.members = action.payload;
        state.membersError = null;
      })
      .addCase(fetchManagerMembers.rejected, (state, action) => {
        state.membersLoading = false;
        state.members = [];
        state.membersError = action.payload || "Failed to load members.";
      })
      .addCase(addManagerMember.pending, (state) => {
        state.addMemberLoading = true;
        state.addMemberError = null;
        state.addMemberSuccess = null;
      })
      .addCase(addManagerMember.fulfilled, (state, action) => {
        state.addMemberLoading = false;
        state.addMemberError = null;
        state.addMemberSuccess = "Member added successfully.";

        const addedMember = action.payload?.member;

        if (!addedMember?.consumer) {
          return;
        }

        const addedConsumerId = addedMember.consumer?.id || addedMember.consumer?._id;
        const existingIndex = state.members.findIndex((item) => {
          const existingConsumerId = item?.consumer?.id || item?.consumer?._id;
          return String(existingConsumerId) === String(addedConsumerId);
        });

        if (existingIndex >= 0) {
          state.members[existingIndex] = {
            ...state.members[existingIndex],
            ...addedMember,
          };
        } else {
          state.members.unshift(addedMember);
        }
      })
      .addCase(addManagerMember.rejected, (state, action) => {
        state.addMemberLoading = false;
        state.addMemberSuccess = null;
        state.addMemberError = action.payload || "Failed to add member.";
      });
  },
});

export const { clearAddMemberStatus } = managerMemberSlice.actions;

export default managerMemberSlice.reducer;
