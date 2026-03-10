import axiosClient from "@/lib/axiosClient";

export async function getManagerProfileApi(managerId) {
  const { data } = await axiosClient.get(`/manager/${managerId}/profile`);
  return data;
}

export async function searchManagersApi(params) {
  const { data } = await axiosClient.get("/manager/search", {
    params,
  });
  return data;
}

export async function getManagerMembersByIdApi(managerId) {
  const { data } = await axiosClient.get(`/manager/${managerId}/members`);
  return data;
}

export async function addMemberToManagerApi(payload) {
  const { data } = await axiosClient.post("/manager/consumers", payload);
  return data;
}
