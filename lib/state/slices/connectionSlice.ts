import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Operation } from "@/lib/types";

export type ConnectionState = {
  offline: boolean;
  queue: Operation[];
  syncing: boolean;
  lastSynced?: number;
};

const initialState: ConnectionState = {
  offline: false,
  queue: [],
  syncing: false,
  lastSynced: Date.now(),
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setOffline: (state, action: PayloadAction<boolean>) => {
      state.offline = action.payload;
    },
    enqueueOperation: (state, action: PayloadAction<Operation>) => {
      state.queue.push(action.payload);
    },
    hydrateQueue: (state, action: PayloadAction<Operation[]>) => {
      state.queue = action.payload;
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    startSync: (state) => {
      state.syncing = true;
    },
    finishSync: (state) => {
      state.syncing = false;
      state.lastSynced = Date.now();
    },
  },
});

export const { setOffline, enqueueOperation, hydrateQueue, clearQueue, startSync, finishSync } =
  connectionSlice.actions;

export default connectionSlice.reducer;
