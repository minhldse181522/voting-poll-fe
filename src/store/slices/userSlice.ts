import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { RootState } from "../RootReducer";

//default value
const initialState: { user: User | null; isAuthenticated: boolean } = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState, //nếu tên phêu bằng tên biến thì sẽ không cần initialState: initialState nó tự hiểu
  reducers: {
    login: (state, actions) => {
      state.user = actions.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser: (state, actions) => {
      state.user = actions.payload;
    },
  },
});
export const { login, logout, setUser } = userSlice.actions;
export const selectUser = (store: RootState) => store.user.user;
export const selectIsAuthenticated = (store: RootState) =>
  store.user.isAuthenticated;
export default userSlice.reducer;
