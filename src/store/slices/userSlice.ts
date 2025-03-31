import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/User";
import { RootState } from "../RootReducer";
//default value
const initialState: null | User = null;

export const userSlice = createSlice({
  name: "user",
  initialState, //nếu tên phêu bằng tên biến thì sẽ không cần initialState: initialState nó tự hiểu
  reducers: {
    login: (_, actions) => actions.payload, //truyền vào actions.payload === user
    setUser: (_, actions) => actions.payload,
    logout: () => initialState, //null
  },
});
export const { login, logout, setUser } = userSlice.actions;
export const selectUser = (store: RootState) => store.user;
export default userSlice.reducer;
// export const selectUser = (store: RootState) => store.user;
