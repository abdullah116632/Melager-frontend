import axiosClient from "@/lib/axiosClient";

export async function loadConsumerSessionApi(payload) {
  const { data } = await axiosClient.post("/consumer/load-session", payload, {
    withCredentials: true,
  });
  return data;
}

export async function requestJoinMessApi(payload) {
  const { data } = await axiosClient.post("/consumer/request-join", payload, {
    withCredentials: true,
  });
  return data;
}

export async function getMyConsumerRequestsToMessApi() {
  const { data } = await axiosClient.get("/consumer/my-requests", {
    withCredentials: true,
  });
  return data;
}


export async function getConsumerRequestByIdsApi({ consumerId, managerId }) {
  const { data } = await axiosClient.get("/consumer/request", {
    params: {
      consumerId,
      managerId,
    },
    withCredentials: true,
  });
  return data;
}
