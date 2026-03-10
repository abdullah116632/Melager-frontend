import axiosClient from "@/lib/axiosClient";

export async function getMonthlyMealsByManagerIdApi(managerId) {
  const { data } = await axiosClient.get(`/monthly-meals/manager/${managerId}`);
  return data;
}
