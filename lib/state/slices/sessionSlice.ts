import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "@/lib/types";

export type SessionState = {
  role: Role;
  user: { id: string; name: string; color: string };
};

const initialState: SessionState = {
  role: "editor",
  user: { id: "me", name: "You", color: "#0ea5e9" },
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = sessionSlice.actions;
export default sessionSlice.reducer;
