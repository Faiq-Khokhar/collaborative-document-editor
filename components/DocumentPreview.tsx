"use client";
import React from "react";
import { Comment, Collaborator } from "@/lib/types";

const Caret = ({ collaborator, idx }: { collaborator: Collaborator; idx: number }) => (
  <span
    key={`${collaborator.id}-${idx}`}
    className="mx-px inline-block h-4 w-0.5 align-middle"
    style={{ backgroundColor: collaborator.color }}
    title={`${collaborator.name} is here`}
  />
);

const injectCarets = (
  text: string,
  offset: number,
  caretMap: Map<number, Collaborator[]>,
  selectionMap: Map<number, string[]>
) => {
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < text.length; i++) {
    const globalIndex = offset + i;
    const carets = caretMap.get(globalIndex);
    if (carets) {
      carets.forEach((c, idx) =>
        nodes.push(<Caret collaborator={c} idx={idx} key={`${c.id}-${globalIndex}-${idx}`} />)
      );
    }
    const selectionColors = selectionMap.get(globalIndex);
    const ch = text[i];
    nodes.push(
      <span
        key={`ch-${globalIndex}`}
        data-index={globalIndex}
        className={selectionColors ? "rounded-sm px-px" : undefined}
        style={selectionColors ? { backgroundColor: `${selectionColors[0]}22` } : undefined}
      >
        {ch === "\n" ? "\n" : ch}
      </span>
    );
  }
  return nodes;
};

export const DocumentPreview = ({
  content,
  comments,
  collaborators,
}: {
  content: string;
  comments: Comment[];
  collaborators: Collaborator[];
}) => {
  const sortedComments = [...comments].sort((a, b) => a.range.start - b.range.start);
  const caretMap = collaborators.reduce((map, c) => {
    map.set(c.cursorIndex, [...(map.get(c.cursorIndex) ?? []), c]);
    return map;
  }, new Map<number, Collaborator[]>());

  const selectionMap = collaborators.reduce((map, c) => {
    if (c.selectionLength > 0) {
      for (let i = 0; i < c.selectionLength; i++) {
        const idx = c.cursorIndex + i;
        map.set(idx, [...(map.get(idx) ?? []), c.color]);
      }
    }
    return map;
  }, new Map<number, string[]>());

  const segments: React.ReactNode[] = [];
  let cursor = 0;

  const pushPlain = (end: number) => {
    if (end <= cursor) return;
    const slice = content.slice(cursor, end);
    segments.push(
      <span key={`plain-${cursor}`}>
        {injectCarets(slice, cursor, caretMap, selectionMap)}
      </span>
    );
    cursor = end;
  };

  sortedComments.forEach((comment) => {
    const start = Math.max(0, Math.min(comment.range.start, content.length));
    const end = Math.max(start, Math.min(comment.range.end, content.length));
    pushPlain(start);
    const highlighted = content.slice(start, end);
    segments.push(
      <span
        key={comment.id}
        className="relative rounded bg-amber-100 px-0.5 text-slate-900"
        title={`${comment.author}: ${comment.body}`}
        style={{ boxShadow: `inset 0 -2px 0 ${comment.color}55` }}
      >
        {injectCarets(highlighted, start, caretMap, selectionMap)}
        <span
          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: comment.color }}
        >
          {comment.author.slice(0, 1)}
        </span>
      </span>
    );
    cursor = end;
  });

  pushPlain(content.length);

  return (
    <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white/70 p-4 font-sans text-slate-900 shadow-sm">
      {segments}
    </div>
  );
};
