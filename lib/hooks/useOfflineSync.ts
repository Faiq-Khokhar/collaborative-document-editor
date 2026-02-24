"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/state/store";
import {
  clearQueue,
  finishSync,
  hydrateQueue,
  startSync,
} from "@/lib/state/slices/connectionSlice";
import { setLastSynced } from "@/lib/state/slices/documentSlice";
import { mockSync } from "@/lib/mock/api";

export const useOfflineSync = () => {
  const dispatch = useAppDispatch();
  const { offline, queue, syncing } = useAppSelector((state) => state.connection);

  // hydrate queue from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem("queued-ops");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          dispatch(hydrateQueue(parsed));
        }
      } catch (err) {
        console.warn("Failed to parse queued ops", err);
      }
    }
  }, [dispatch]);

  // persist queue for offline resilience
  useEffect(() => {
    localStorage.setItem("queued-ops", JSON.stringify(queue));
  }, [queue]);

  // sync when back online
  useEffect(() => {
    if (!offline && queue.length > 0 && !syncing) {
      const run = async () => {
        dispatch(startSync());
        await mockSync(queue);
        dispatch(finishSync());
        dispatch(clearQueue());
        dispatch(setLastSynced(Date.now()));
      };
      run();
    }
  }, [offline, queue, syncing, dispatch]);
};
