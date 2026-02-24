"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/state/store";
import { updatePresence } from "@/lib/state/slices/presenceSlice";
import { applyRemoteInsert } from "@/lib/state/slices/documentSlice";

const phrases = ["✨", "⏳", "draft", "note", "(?)", "fix"];

export const usePresenceSimulation = () => {
  const dispatch = useAppDispatch();
  const contentLength = useAppSelector((s) => s.document.content.length);
  const collaborators = useAppSelector((s) => s.presence.collaborators);
  const offline = useAppSelector((s) => s.connection.offline);

  useEffect(() => {
    const interval = setInterval(() => {
      if (offline || collaborators.length === 0) return;
      const target = collaborators[Math.floor(Math.random() * collaborators.length)];
      const cursorIndex = Math.floor(Math.random() * Math.max(1, contentLength));
      const selectionLength = Math.random() > 0.7 ? Math.floor(Math.random() * 8) : 0;

      dispatch(updatePresence({ id: target.id, cursorIndex, selectionLength }));

      // sprinkle an occasional remote insert to suggest real-time edits
      if (Math.random() > 0.65) {
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        dispatch(applyRemoteInsert({ index: cursorIndex, text: ` ${text}` }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [collaborators, contentLength, dispatch, offline]);
};
