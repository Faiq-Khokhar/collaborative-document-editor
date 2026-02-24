import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Comment } from "@/lib/types";

export type CommentsState = {
  items: Comment[];
};

const initialState: CommentsState = {
  items: [
    {
      id: "seed-1",
      author: "Ahmer",
      body: "Consider tightening the intro for readability.",
      createdAt: Date.now() - 1000 * 60 * 60,
      range: { start: 0, end: 34 },
      color: "#f59e0b",
    },
  ],
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.items.push(action.payload);
    },
    removeComment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    hydrateComments: (state, action: PayloadAction<Comment[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addComment, removeComment, hydrateComments } = commentsSlice.actions;

export default commentsSlice.reducer;
