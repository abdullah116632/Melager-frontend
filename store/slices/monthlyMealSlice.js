import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMonthlyMealsByManagerIdApi } from "@/services/monthlyMealService";

const initialState = {
  monthlyMeals: [],
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

function normalizeMealsMap(meals) {
  if (!meals || typeof meals !== "object") {
    return {};
  }

  return Object.entries(meals).reduce((acc, [key, value]) => {
    const dayNumber = Number(key);

    if (!Number.isInteger(dayNumber) || dayNumber < 1 || dayNumber > 31) {
      return acc;
    }

    acc[String(dayNumber)] = {
      breakfast: Boolean(value?.breakfast),
      lunch: Boolean(value?.lunch),
      dinner: Boolean(value?.dinner),
      totalMeal: Number(value?.totalMeal || 0),
      day: value?.day || "",
    };

    return acc;
  }, {});
}

function normalizeMonthlyMeal(doc) {
  return {
    id: doc?.id || doc?._id,
    consumerId: doc?.consumerId,
    managerId: doc?.managerId,
    month: Number(doc?.month || 0),
    year: Number(doc?.year || 0),
    totalsMela: Number(doc?.totalsMela || 0),
    consumer: doc?.consumer || null,
    meals: normalizeMealsMap(doc?.meals),
    updatedAt: doc?.updatedAt || doc?.createdAt || null,
  };
}

export const fetchManagerMonthlyMeals = createAsyncThunk(
  "monthlyMeal/fetchManagerMonthlyMeals",
  async (_, { getState, rejectWithValue }) => {
    try {
      const authState = getState().auth || {};
      const managerId =
        authState?.user?.id || authState?.user?._id || decodeManagerIdFromToken(authState?.token);

      if (!managerId) {
        return rejectWithValue("Manager ID not found. Please login again.");
      }

      const response = await getMonthlyMealsByManagerIdApi(managerId);
      const monthlyMeals = response?.data?.monthlyMeals || response?.monthlyMeals || [];

      if (!Array.isArray(monthlyMeals)) {
        return [];
      }

      return monthlyMeals.map(normalizeMonthlyMeal);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load monthly meals."
      );
    }
  }
);

const monthlyMealSlice = createSlice({
  name: "monthlyMeal",
  initialState,
  reducers: {
    updateMonthlyMealField: (state, action) => {
      const { sheetId, day, field, value } = action.payload || {};

      if (!sheetId || !day || !field) {
        return;
      }

      const sheetIndex = state.monthlyMeals.findIndex((sheet) => String(sheet?.id) === String(sheetId));

      if (sheetIndex < 0) {
        return;
      }

      const dayKey = String(day);
      const existingMeal = state.monthlyMeals[sheetIndex].meals?.[dayKey] || {
        breakfast: false,
        lunch: false,
        dinner: false,
        totalMeal: 0,
        day: "",
      };

      const updatedMeal = {
        ...existingMeal,
        [field]: value,
      };

      if (field === "breakfast" || field === "lunch" || field === "dinner") {
        updatedMeal.totalMeal =
          Number(Boolean(updatedMeal.breakfast)) +
          Number(Boolean(updatedMeal.lunch)) +
          Number(Boolean(updatedMeal.dinner));
      }

      state.monthlyMeals[sheetIndex].meals = {
        ...state.monthlyMeals[sheetIndex].meals,
        [dayKey]: updatedMeal,
      };

      state.monthlyMeals[sheetIndex].totalsMela = Object.values(state.monthlyMeals[sheetIndex].meals).reduce(
        (sum, meal) => sum + Number(meal?.totalMeal || 0),
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagerMonthlyMeals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchManagerMonthlyMeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.monthlyMeals = action.payload;
      })
      .addCase(fetchManagerMonthlyMeals.rejected, (state, action) => {
        state.isLoading = false;
        state.monthlyMeals = [];
        state.error = action.payload || "Failed to load monthly meals.";
      });
  },
});

export const { updateMonthlyMealField } = monthlyMealSlice.actions;

export default monthlyMealSlice.reducer;
