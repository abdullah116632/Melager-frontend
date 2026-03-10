import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSignupDrawerOpen: false,
  isLoginDrawerOpen: false,
  isForgotDrawerOpen: false,
  isVerifyOtpDrawerOpen: false,
  isAccessDrawerOpen: false,
  isRequestDrawerOpen: false,
  signupEmail: "",
  accessTargetMessName: "",
  accessTargetManagerId: "",
  selectedMessName: "",
  selectedManagerId: "",
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    closeAllDrawers: (state) => {
      state.isSignupDrawerOpen = false;
      state.isLoginDrawerOpen = false;
      state.isForgotDrawerOpen = false;
      state.isVerifyOtpDrawerOpen = false;
      state.isAccessDrawerOpen = false;
      state.isRequestDrawerOpen = false;
      state.signupEmail = "";
      state.accessTargetMessName = "";
      state.accessTargetManagerId = "";
      state.selectedMessName = "";
      state.selectedManagerId = "";
    },
    openLoginDrawer: (state) => {
      state.isSignupDrawerOpen = false;
      state.isForgotDrawerOpen = false;
      state.isVerifyOtpDrawerOpen = false;
      state.isLoginDrawerOpen = true;
    },
    openSignupDrawer: (state) => {
      state.isLoginDrawerOpen = false;
      state.isForgotDrawerOpen = false;
      state.isVerifyOtpDrawerOpen = false;
      state.isSignupDrawerOpen = true;
    },
    openForgotDrawer: (state) => {
      state.isLoginDrawerOpen = false;
      state.isForgotDrawerOpen = true;
    },
    closeSignupDrawer: (state) => {
      state.isSignupDrawerOpen = false;
    },
    closeLoginDrawer: (state) => {
      state.isLoginDrawerOpen = false;
    },
    closeForgotDrawer: (state) => {
      state.isForgotDrawerOpen = false;
    },
    closeVerifyOtpDrawer: (state) => {
      state.isVerifyOtpDrawerOpen = false;
    },
    handleSignupSuccessUi: (state, action) => {
      const { email, token } = action.payload || {};

      if (token) {
        state.isSignupDrawerOpen = false;
        state.isVerifyOtpDrawerOpen = false;
        state.isLoginDrawerOpen = false;
        state.isForgotDrawerOpen = false;
        state.signupEmail = "";
        return;
      }

      state.signupEmail = email || "";
      state.isSignupDrawerOpen = false;
      state.isVerifyOtpDrawerOpen = true;
    },
    handleVerifySuccessUi: (state) => {
      state.isVerifyOtpDrawerOpen = false;
      state.isSignupDrawerOpen = false;
      state.isLoginDrawerOpen = false;
      state.isForgotDrawerOpen = false;
      state.signupEmail = "";
    },
    backToSignupFromVerify: (state) => {
      state.isVerifyOtpDrawerOpen = false;
      state.isSignupDrawerOpen = true;
    },
    backToLoginFromForgot: (state) => {
      state.isForgotDrawerOpen = false;
      state.isLoginDrawerOpen = true;
    },
    openAccessDrawer: (state, action) => {
      const manager = action.payload || {};
      state.accessTargetMessName = manager?.nameOfMess || manager?.messName || "";
      state.accessTargetManagerId = manager?.id || manager?._id || "";
      state.isAccessDrawerOpen = true;
    },
    closeAccessDrawer: (state) => {
      state.isAccessDrawerOpen = false;
      state.accessTargetMessName = "";
      state.accessTargetManagerId = "";
    },
    openRequestDrawer: (state, action) => {
      const manager = action.payload || {};
      state.selectedMessName = manager?.nameOfMess || manager?.messName || "";
      state.selectedManagerId = manager?.id || manager?._id || "";
      state.isRequestDrawerOpen = true;
    },
    closeRequestDrawer: (state) => {
      state.isRequestDrawerOpen = false;
      state.selectedMessName = "";
      state.selectedManagerId = "";
    },
  },
});

export const {
  closeAllDrawers,
  openLoginDrawer,
  openSignupDrawer,
  openForgotDrawer,
  closeSignupDrawer,
  closeLoginDrawer,
  closeForgotDrawer,
  closeVerifyOtpDrawer,
  handleSignupSuccessUi,
  handleVerifySuccessUi,
  backToSignupFromVerify,
  backToLoginFromForgot,
  openAccessDrawer,
  closeAccessDrawer,
  openRequestDrawer,
  closeRequestDrawer,
} = drawerSlice.actions;

export default drawerSlice.reducer;
