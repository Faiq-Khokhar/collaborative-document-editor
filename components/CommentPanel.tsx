"use client";
import { Comment } from "@/lib/types";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { TimeCell } from "./TimeCell";

export const CommentPanel = ({
  comments,
  selectionText,
  onAdd,
  onDelete,
  disabled,
  mounted,
}: {
  comments: Comment[];
  selectionText: string;
  onAdd: (body: string) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
  mounted: boolean;
}) => {
  const [draft, setDraft] = useState("");

  const handleSubmit = () => {
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Inline comments
          </p>
          <p className="text-xs text-slate-500">
            Select text then drop feedback.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
          {comments.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          Selected text
        </label>
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {selectionText ? selectionText : "Select a span in the doc"}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-600">
          New comment
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            disabled ? "Switch to Editor/Reviewer" : "Add context..."
          }
          disabled={disabled}
          className="min-h-22.5 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-inner placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !selectionText}
          className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Add comment
        </button>
      </div>

      <div className="mt-2 space-y-3 overflow-y-auto">
        {comments.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 shadow-inner"
          >
            <div className="flex text-xs items-center justify-between text-slate-500">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <span className="font-semibold text-slate-700">{c.author}</span>
                <span>•</span>
                <TimeCell ts={c.createdAt} mounted={mounted} />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-rose-200 bg-white px-2 py-1 text-xs font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                  aria-label="Delete comment"
                  title="Delete comment"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-slate-900">{c.body}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-slate-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};
