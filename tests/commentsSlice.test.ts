import { describe, expect, it } from "vitest";
import commentsReducer, { addComment, removeComment } from "@/lib/state/slices/commentsSlice";
import { Comment } from "@/lib/types";

describe("comments slice", () => {
  const sample: Comment = {
    id: "abc",
    author: "Test",
    body: "Hello",
    createdAt: 123,
    range: { start: 0, end: 4 },
    color: "#000",
  };

  it("adds a comment", () => {
    const next = commentsReducer(undefined, addComment(sample));
    expect(next.items.find((c) => c.id === "abc")).toBeTruthy();
  });

  it("removes a comment", () => {
    const withOne = commentsReducer(undefined, addComment(sample));
    const removed = commentsReducer(withOne, removeComment("abc"));
    expect(removed.items.find((c) => c.id === "abc")).toBeFalsy();
  });
});
