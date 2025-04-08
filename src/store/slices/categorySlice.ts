import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../types/Category";

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
