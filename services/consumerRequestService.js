import axiosClient from "@/lib/axiosClient";

export async function getManagerConsumerRequestsByIdApi(managerId) {
  const { data } = await axiosClient.get(`/manager/${managerId}/requests`);
  return data;
}
