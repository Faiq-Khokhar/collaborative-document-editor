import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import documentReducer from "./slices/documentSlice";
import commentsReducer from "./slices/commentsSlice";
import connectionReducer from "./slices/connectionSlice";
import presenceReducer from "./slices/presenceSlice";
import sessionReducer from "./slices/sessionSlice";

export const store = configureStore({
  reducer: {
    document: documentReducer,
    comments: commentsReducer,
    connection: connectionReducer,
    presence: presenceReducer,
    session: sessionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
