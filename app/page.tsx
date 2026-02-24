"use client";

import { useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { RoleSelector } from "@/components/RoleSelector";
import { OfflineToggle } from "@/components/OfflineToggle";
import { PresenceList } from "@/components/PresenceList";
import { CommentPanel } from "@/components/CommentPanel";
import { DocumentPreview } from "@/components/DocumentPreview";
import { useAppDispatch, useAppSelector } from "@/lib/state/store";
import { updateContent, setLastSynced } from "@/lib/state/slices/documentSlice";
import { addComment, removeComment } from "@/lib/state/slices/commentsSlice";
import {
  enqueueOperation,
  setOffline,
} from "@/lib/state/slices/connectionSlice";
import { useOfflineSync } from "@/lib/hooks/useOfflineSync";
import { usePresenceSimulation } from "@/lib/hooks/usePresenceSimulation";
import { Role } from "@/lib/types";
import { Typography } from "@/components/Typography";

const roleCopy: Record<Role, string> = {
  editor: "Full editing + comments",
  reviewer: "Comment-only",
  viewer: "Read-only",
};

export default function Home() {
  const dispatch = useAppDispatch();
  const { content } = useAppSelector(
    (s) => s.document,
  );
  const comments = useAppSelector((s) => s.comments.items);
  const { role, user } = useAppSelector((s) => s.session);
  const { offline, queue, syncing } = useAppSelector((s) => s.connection);
  const collaborators = useAppSelector((s) => s.presence.collaborators);

  const [mounted, setMounted] = useState(false);

  useOfflineSync();
  usePresenceSimulation();

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const selectionText = useMemo(
    () => content.slice(selection.start, selection.end),
    [content, selection],
  );

  const canEdit = role === "editor";
  const canComment = role !== "viewer";

  const handleContentChange = (value: string) => {
    if (role === "viewer") return;
    dispatch(updateContent(value));

    if (offline) {
      dispatch(
        enqueueOperation({
          id: nanoid(),
          kind: "content",
          payload: { content: value },
        }),
      );
    } else {
      dispatch(setLastSynced(Date.now()));
    }
  };

  const handleAddComment = (body: string) => {
    if (!selectionText) return;
    const comment = {
      id: nanoid(),
      author: user.name,
      body,
      createdAt: Date.now(),
      range: { ...selection },
      color: user.color,
    };
    dispatch(addComment(comment));
    if (offline) {
      dispatch(
        enqueueOperation({ id: nanoid(), kind: "comment", payload: comment }),
      );
    }
  };

  const handleDeleteComment = (id: string) => {
    dispatch(removeComment(id));
    if (offline) {
      dispatch(
        enqueueOperation({
          id: nanoid(),
          kind: "comment-delete",
          payload: { id },
        }),
      );
    } else {
      dispatch(setLastSynced(Date.now()));
    }
  };

  const offlineBanner = offline ? (
    <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
        <div>
          <p className="font-semibold">Offline mode</p>
          <p className="text-xs text-amber-800">
            Changes are queued locally and will sync when you reconnect.
          </p>
        </div>
      </div>
      <div className="text-xs font-semibold">{queue.length} queued</div>
    </div>
  ) : null;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-slate-100 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Typography as="h1" size="h1" tone="default" weight="bold">
              Collab Notes
            </Typography>
            <PresenceList collaborators={collaborators} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <RoleSelector />
            <div className="rounded-full bg-linear-to-r from-sky-100 to-indigo-100 px-3 py-2 text-xs font-semibold text-slate-800 shadow-inner">
              <Typography
                as="span"
                size="xs"
                tone="muted"
                className="font-semibold"
              >
                {roleCopy[role]}
              </Typography>
            </div>
            <OfflineToggle />
            <div className="ml-auto flex items-center gap-3 text-xs text-slate-600">
              <Typography
                as="span"
                size="xs"
                className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700"
              >
                {offline ? "Waiting to sync" : syncing ? "Syncing" : "Online"}
              </Typography>
            </div>
          </div>
          {offlineBanner}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
            <Typography as="span" size="xs" weight="medium" tone="subtle">
              Characters
            </Typography>
            <p className="text-2xl font-semibold text-slate-900">
              {content.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
            <Typography as="span" size="xs" weight="medium" tone="subtle">
              Comments
            </Typography>
            <p className="text-2xl font-semibold text-slate-900">
              {comments.length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm">
            <Typography as="span" size="xs" weight="medium" tone="subtle">
              In Queue ( characters )
            </Typography>
            <p className="text-2xl font-semibold text-slate-900">
              {queue.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
                <Typography as="span" size="sm" weight="medium">
                  Document body
                </Typography>
                {canEdit ? (
                  <Typography
                    as="span"
                    size="xs"
                    weight="semibold"
                    className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700"
                  >
                    Editing enabled
                  </Typography>
                ) : role === "reviewer" ? (
                  <Typography
                    as="span"
                    size="xs"
                    weight="semibold"
                    className="rounded-full bg-indigo-50 px-2 py-1 text-indigo-700"
                  >
                    Comment-only
                  </Typography>
                ) : (
                  <Typography
                    as="span"
                    size="xs"
                    weight="semibold"
                    className="rounded-full bg-slate-50 px-2 py-1 text-slate-600"
                  >
                    Read-only
                  </Typography>
                )}
              </div>
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                onSelect={(e) =>
                  setSelection({
                    start: e.currentTarget.selectionStart ?? 0,
                    end: e.currentTarget.selectionEnd ?? 0,
                  })
                }
                readOnly={!canEdit}
                className="h-56 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-sm text-slate-900 shadow-inner outline-none focus:border-sky-400 disabled:cursor-not-allowed"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <Typography as="p" size="xs" weight="medium">
                  {content.length} characters
                </Typography>
                <button
                  type="button"
                  onClick={() => dispatch(setOffline(!offline))}
                  className="text-sky-600 underline"
                >
                  {offline ? "Go online" : "Simulate offline"}
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <Typography as="span" size="sm" weight="medium">
                  Live preview with comments & cursors
                </Typography>
                <Typography
                  as="span"
                  size="xs"
                  tone="muted"
                  weight="semibold"
                  className="rounded-full bg-slate-100 px-3 py-1"
                >
                  Presence injected every ~10s
                </Typography>
              </div>
              <DocumentPreview
                content={content}
                comments={comments}
                collaborators={collaborators}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <CommentPanel
              comments={comments}
              selectionText={selectionText}
              onAdd={handleAddComment}
              onDelete={handleDeleteComment}
              disabled={!canComment || selectionText.length === 0}
              mounted={mounted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
