import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import consumerReducer from "@/store/slices/consumerSlice";
import consumerRequestReducer from "@/store/slices/consumerRequestSlice";
import drawerReducer from "@/store/slices/drawerSlice";
import messMemberReducer from "@/store/slices/managerMemberSlice";
import managerSearchReducer from "@/store/slices/managerSearchSlice";
import monthlyMealReducer from "@/store/slices/monthlyMealSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    consumer: consumerReducer,
    consumerRequest: consumerRequestReducer,
    drawer: drawerReducer,
    messMember: messMemberReducer,
    managerSearch: managerSearchReducer,
    monthlyMeal: monthlyMealReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
