import api from "../config/axios";
import { AddCategory, UpdateCategory } from "../types/Category";
import {
  AddPerformance,
  UpdateCategoryVote,
  UpdatePerformaceBody,
  UpdatePerformance,
} from "../types/Performance";
import { AddSettings, UpdateLanguage } from "../types/Settings";

export const getPerformanceByCategory = (id: number) => {
  return api.get(`/api/performanceByCategory/${id}`);
};

export const votePerformance = (id: string, data: UpdatePerformance) => {
  return api.put(`/api/performances/${id}`, data);
};

export const toggleVotePermit = (id: string, data: UpdateCategoryVote) => {
  return api.put(`/api/categoryVote/${id}`, data);
};

export const getCategories = () => {
  return api.get("/api/categories");
};

export const addCategory = (data: AddCategory[]) => {
  return api.post("/api/category", data);
};

export const updateCategory = (id: string, data: UpdateCategory) => {
  return api.put(`/api/category/${id}`, data);
};

export const deleteCategory = (id: string) => {
  return api.delete(`/api/category/${id}`);
};

export const addPerformance = (data: AddPerformance[]) => {
  return api.post("/api/performance", data);
};

export const deletePerformance = (id: string) => {
  return api.delete(`/api/performance/${id}`);
};

export const updatePerformance = (id: string, data: UpdatePerformaceBody) => {
  return api.put(`/api/performance/${id}`, data);
};

export const getSettings = () => {
  return api.get("/api/settings");
};

export const addSettings = (data: AddSettings) => {
  return api.post("/api/setting", data);
};

export const updateLanguage = (id: string, data: UpdateLanguage) => {
  return api.put(`/api/settingLanguage/${id}`, data);
};
