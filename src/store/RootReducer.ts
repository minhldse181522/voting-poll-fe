import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import performanceSlice from "./slices/performanceSlice";

const rootReducer = combineReducers({
  user: userSlice,
  performance: performanceSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
