import axiosClient from "@/lib/axiosClient";

export async function loginApi(payload) {
  const { data } = await axiosClient.post("/auth/login", payload);
  return data;
}

export async function registerApi(payload) {
  const { data } = await axiosClient.post("/auth/register", payload);
  return data;
}

export async function meApi() {
  const { data } = await axiosClient.get("/auth/me");
  return data;
}

export async function logoutApi() {
  const { data } = await axiosClient.post("/auth/logout");
  return data;
}
