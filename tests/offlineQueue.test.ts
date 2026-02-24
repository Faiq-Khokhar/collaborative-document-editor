import { describe, expect, it } from "vitest";
import connectionReducer, {
  setOffline,
  enqueueOperation,
  clearQueue,
  startSync,
  finishSync,
} from "@/lib/state/slices/connectionSlice";
import { Operation } from "@/lib/types";

describe("offline queue", () => {
  const op: Operation = { id: "1", kind: "content", payload: { content: "hello" } };

  it("queues operations while offline", () => {
    const offlineState = connectionReducer(undefined, setOffline(true));
    const withQueued = connectionReducer(offlineState, enqueueOperation(op));
    expect(withQueued.queue).toHaveLength(1);
    expect(withQueued.queue[0]).toEqual(op);
  });

  it("clears queue after sync", () => {
    const queued = connectionReducer(undefined, enqueueOperation(op));
    const syncing = connectionReducer(queued, startSync());
    const finished = connectionReducer(syncing, finishSync());
    const cleared = connectionReducer(finished, clearQueue());
    expect(cleared.queue).toHaveLength(0);
    expect(cleared.syncing).toBe(false);
    expect(typeof cleared.lastSynced).toBe("number");
  });
});
