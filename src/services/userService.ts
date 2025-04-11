import api from "../config/axios";
import { AddCategory, UpdateCategory } from "../types/Category";
import {
	AddPerformance,
	UpdatePerformaceBody,
	UpdatePerformance,
} from "../types/Performance";

export const getPerformanceByCategory = (id: number) => {
	return api.get(`/api/performanceByCategory/${id}`);
};

export const votePerformance = (id: string, data: UpdatePerformance) => {
	return api.put(`/api/performances/${id}`, data);
};

export const getCategories = () => {
	return api.get("/api/categories");
};

export const addCategory = (data: AddCategory) => {
	return api.post("/api/category", data);
};

export const updateCategory = (id: string, data: UpdateCategory) => {
	return api.put(`/api/category/${id}`, data);
};

export const deleteCategory = (id: string) => {
	return api.delete(`/api/category/${id}`);
};

export const addPerformance = (data: AddPerformance) => {
	return api.post("/api/performance", data);
};

export const deletePerformance = (id: string) => {
	return api.delete(`/api/performance/${id}`);
};

export const updatePerformance = (id: string, data: UpdatePerformaceBody) => {
	return api.put(`/api/performance/${id}`, data);
};
