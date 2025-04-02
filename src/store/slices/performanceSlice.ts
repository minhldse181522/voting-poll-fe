import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Performance } from "../../types/Performance";

interface PerformanceState {
  performances: Performance[];
}

const initialState: PerformanceState = {
  performances: [],
};

export const performanceSlice = createSlice({
  name: "performances",
  initialState,
  reducers: {
    setPerformances: (state, action: PayloadAction<Performance[]>) => {
      state.performances = action.payload;
    },
    updateVote: (
      state,
      action: PayloadAction<{ id: string; vote: number }>
    ) => {
      const { id, vote } = action.payload;
      const performance = state.performances.find(
        (p) => p.id === id
      );
      if (performance) {
        performance.vote = vote;
      }
    },
  },
});

export const { setPerformances, updateVote } = performanceSlice.actions;
export default performanceSlice.reducer;
