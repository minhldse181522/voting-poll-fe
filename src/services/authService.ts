import api from "../config/axios"

interface LoginData {
  username: string;
  password: string;
}

export const loginUser = (data: LoginData) => {
    return api.post("/api/public/login", data)
}