import axiosClient from "@/lib/axiosClient";

export async function getMyMessesApi() {
  const { data } = await axiosClient.get("/consumer/my-messes", {
    withCredentials: true,
  });
  return data;
}
