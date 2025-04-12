/* eslint-disable @typescript-eslint/no-explicit-any */
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
    setVotingState: (
      state,
      action: PayloadAction<{ id: string; enabled: boolean }>
    ) => {
      const { id, enabled } = action.payload;
      const category = state.categories.find((c) => c.id === id);
      if (category) {
        category.enabled = enabled;
      }
    },
  },
});

export const { setCategories, setVotingState } = categorySlice.actions;
// Thêm selector này vào categorySlice.ts hoặc file selectors.ts
export const selectVotingEnabledByCategory = (
  state: any,
  categoryId: string
) => {
  const category = state.category.categories.find(
    (c: any) => c.id === categoryId
  );
  return category?.enabled ?? false;
};

export default categorySlice.reducer;
