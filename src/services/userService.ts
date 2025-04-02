import api from "../config/axios";

export const getPerformances = () => {
  return api.get("/api/performances");
};

export const votePerformance = (id: string) => {
  return api.put(`/api/performances/${id}`);
};
