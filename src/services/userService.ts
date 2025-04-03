import api from "../config/axios";
import { UpdatePerformance } from "../types/Performance";

export const getPerformanceByCategory = (id: number) => {
  return api.get(`/api/performanceByCategory/${id}`);
};

export const votePerformance = (id: string, data: UpdatePerformance) => {
  return api.put(`/api/performances/${id}`, data);
};

export const getCategories = () => {
  return api.get("/api/categories");
};
