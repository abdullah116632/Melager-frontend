import axiosClient from "@/lib/axiosClient";

export async function getManagerConsumerRequestsByIdApi(managerId) {
  const { data } = await axiosClient.get(`/manager/${managerId}/requests`);
  return data;
}

export async function acceptConsumerRequestApi(requestId) {
  const { data } = await axiosClient.post(`/manager/requests/${requestId}/accept`);
  return data;
}

export async function rejectConsumerRequestApi(requestId) {
  const { data } = await axiosClient.post(`/manager/requests/${requestId}/reject`);
  return data;
}
