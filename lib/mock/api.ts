export const mockSync = async (payload: unknown) => {
  // simulate network latency + acceptance
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true, payload, appliedAt: Date.now() } as const;
};

export const mockRemoteInsert = async (text: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { text };
};
