export type Role = "editor" | "reviewer" | "viewer";

export type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: number;
  range: { start: number; end: number };
  color: string;
};

export type Collaborator = {
  id: string;
  name: string;
  color: string;
  cursorIndex: number;
  selectionLength: number;
  avatar: string;
  lastActive: number;
};

export type Operation =
  | { id: string; kind: "content"; payload: { content: string } }
  | { id: string; kind: "comment"; payload: Comment }
  | { id: string; kind: "comment-delete"; payload: { id: string } };
