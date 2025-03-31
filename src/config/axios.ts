import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_DB_HOST_API,
});
// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    //chạy trước khi call api
    const token = localStorage.getItem("token");
    //set token cho api
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
export default api;
