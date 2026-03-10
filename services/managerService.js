import axiosClient from "@/lib/axiosClient";

export async function getManagerProfileApi(managerId) {
  const { data } = await axiosClient.get(`/managers/${managerId}/profile`);
  return data;
}

export async function searchManagersApi(params) {
  const { data } = await axiosClient.get("/managers/search", {
    params,
  });
  return data;
}
