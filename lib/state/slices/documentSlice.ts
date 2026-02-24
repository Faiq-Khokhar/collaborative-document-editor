import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DocumentState = {
  content: string;
  lastUpdated: number;
  lastSynced?: number;
};

const initialState: DocumentState = {
  content:
    "Collaborative Document Editor for ILI.DIGITAL\n\n- Track edits, comments, and presence in one place.\n- Offline-safe: queue changes and proceed them when back online.\n- Reviewers can annotate without mutating the doc.\n- Viewers stay read-only but see live presence and comments.",
  lastUpdated: Date.now(),
  lastSynced: Date.now(),
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    updateContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
      state.lastUpdated = Date.now();
    },
    applyRemoteInsert: (
      state,
      action: PayloadAction<{ index: number; text: string }>
    ) => {
      const { index, text } = action.payload;
      const safeIndex = Math.max(0, Math.min(index, state.content.length));
      state.content =
        state.content.slice(0, safeIndex) +
        text +
        state.content.slice(safeIndex);
      state.lastUpdated = Date.now();
    },
    setLastSynced: (state, action: PayloadAction<number | undefined>) => {
      state.lastSynced = action.payload;
    },
  },
});

export const { updateContent, applyRemoteInsert, setLastSynced } =
  documentSlice.actions;

export default documentSlice.reducer;
