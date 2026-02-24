# Collaborative Document Editor

Next.js + TypeScript + Redux Toolkit + Tailwind CSS frontend that simulates a collaborative doc editor: role-based access, inline comments, presence cursors, offline queueing/sync, and lightweight mock APIs. Includes optional Vitest unit tests for core reducers.

**Stacks & tooling used:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Redux Toolkit + React Redux, lucide-react icons, class-variance-authority (typography), nanoid, Vitest for unit tests, and simple mock APIs/localStorage for offline queueing.

## Quick start
```bash
npm install
npm run dev
```
- Lint: `npm run lint`
- Tests: `npm run test`

## Core features
- **Role-based access** — Editor (edit+comment), Reviewer (comment-only), Viewer (read-only) via the toolbar selector.
- **Live-ish editing** — Textarea drives document state; simulated collaborator inserts & cursor/selection moves every ~10s.
- **Presence viz** — Colored carets and selection tints per collaborator in the preview; avatar stack in the header.
- **Inline comments** — Select text, add comments; highlights inline with author badges; delete via Lucide trash icon.
- **Offline mode** — Toggle offline to queue edits/comments; banner shows queued count; mock sync flushes on reconnect and updates last sync time (with skeleton placeholder while hydrating).

## Project layout
```
app/
  layout.tsx        # providers + global shell
  page.tsx          # main UI (toolbar, editor, preview, metrics, comments)
components/
  CommentPanel      # list + composer + delete actions
  DocumentPreview   # content render w/ highlights & carets
  PresenceList      # avatar stack
  RoleSelector      # role dropdown
  OfflineToggle     # offline switch
  TimeCell          # reusable time/skeleton display
  Typography        # cva-based type scale
hooks/
  useOfflineSync    # queue persistence + mock sync replay
  usePresenceSimulation # random presence + inserts every ~10s
lib/state/          # Redux slices (document, comments, connection, presence, session)
lib/mock/api.ts     # mockSync + remote insert helpers
```
Architecture diagram: see `public/assets/architecture-diagram.png`.

## State & offline strategy
- Redux Toolkit for all app state; slices kept small and focused.
- Offline toggle sets `connection.offline`; edits/comments enqueue `Operation`s (persisted to localStorage).
- `useOfflineSync` watches connectivity: on reconnection it mocks a sync, clears the queue, and stamps `lastSynced` (rendered via `TimeCell`).
- Presence simulation pauses when offline to avoid confusing UI.

## Typography
`components/Typography.tsx` exposes a cva scale aligned to Tailwind utility classes (`h1`…`sm`) plus tone variants, matching the project’s type ramp.

I used two styling approaches side by side (my usual pattern): a reusable typography component/boilerplate (pre-set sizes, tones, colors) for rapid consistency, and straightforward Tailwind classes in places where speed mattered, in order to let the reviewer know I do know both of the approaches. This keeps a balance between systematized design tokens and pragmatic, time-boxed styling.

## Optional Redux persistence
If we need state to survive reloads, we can also persist the reducer as well.

## Tests
- `tests/offlineQueue.test.ts` — ensures queueing and clearing during sync lifecycle.
- `tests/commentsSlice.test.ts` — add/remove comment reducers.
Run with `npm run test` (Vitest).

## Assumptions & future work
- Mock-only backend; no persistence beyond in-memory + localStorage queue.
