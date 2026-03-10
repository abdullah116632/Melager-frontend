import axiosClient from "@/lib/axiosClient";

export async function loginApi(payload) {
  const { data } = await axiosClient.post("/auth/login", payload);
  return data;
}

export async function registerApi(payload) {
  const { data } = await axiosClient.post("/auth/register", payload);
  return data;
}

export async function verifyRegistrationOtpApi(payload) {
  const { data } = await axiosClient.post("/auth/verify-otp", payload);
  return data;
}

export async function resendRegistrationOtpApi(payload) {
  const { data } = await axiosClient.post("/auth/resend-otp", payload);
  return data;
}

export async function logoutApi() {
  const { data } = await axiosClient.post("/auth/logout");
  return data;
}
