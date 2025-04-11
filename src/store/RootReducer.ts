import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import performanceSlice from "./slices/performanceSlice";
import categorySlice from "./slices/categorySlice";

const rootReducer = combineReducers({
  user: userSlice,
  performance: performanceSlice,
  category: categorySlice,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
