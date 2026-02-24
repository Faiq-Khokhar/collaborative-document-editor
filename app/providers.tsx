"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/state/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
