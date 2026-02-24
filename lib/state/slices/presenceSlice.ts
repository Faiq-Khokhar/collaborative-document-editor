import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Collaborator } from "@/lib/types";

export type PresenceState = {
  collaborators: Collaborator[];
};

const palette = ["#22c55e", "#3b82f6", "#a855f7", "#f97316"];

const seedCollaborators: Collaborator[] = [
  {
    id: "c1",
    name: "Ahmer",
    color: palette[0],
    cursorIndex: 8,
    selectionLength: 0,
    avatar: "A",
    lastActive: Date.now(),
  },
  {
    id: "c2",
    name: "Nouman",
    color: palette[1],
    cursorIndex: 35,
    selectionLength: 4,
    avatar: "N",
    lastActive: Date.now(),
  },
  {
    id: "c3",
    name: "Zabdial",
    color: palette[2],
    cursorIndex: 62,
    selectionLength: 0,
    avatar: "Z",
    lastActive: Date.now(),
  },
];

const initialState: PresenceState = {
  collaborators: seedCollaborators,
};

const presenceSlice = createSlice({
  name: "presence",
  initialState,
  reducers: {
    updatePresence: (
      state,
      action: PayloadAction<{ id: string; cursorIndex: number; selectionLength?: number }>
    ) => {
      const target = state.collaborators.find((c) => c.id === action.payload.id);
      if (target) {
        target.cursorIndex = action.payload.cursorIndex;
        target.selectionLength = action.payload.selectionLength ?? 0;
        target.lastActive = Date.now();
      }
    },
  },
});

export const { updatePresence } = presenceSlice.actions;
export default presenceSlice.reducer;
