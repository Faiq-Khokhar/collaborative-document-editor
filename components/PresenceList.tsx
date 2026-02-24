"use client";
import { Collaborator } from "@/lib/types";
import { Typography } from "./Typography";

export const PresenceList = ({
  collaborators,
}: {
  collaborators: Collaborator[];
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-3">
        {collaborators.map((c) => (
          <div
            key={c.id}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white text-sm font-semibold shadow-sm"
            style={{ backgroundColor: `${c.color}22`, color: c.color }}
            title={`${c.name} · last seen ${new Date(
              c.lastActive,
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          >
            {c.avatar}
            <Typography
              as="span"
              className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white"
              style={{ backgroundColor: c.color }}
            />
          </div>
        ))}
      </div>
      <Typography as="p" size="xs" tone="muted">
        {collaborators.length} collaborators live
      </Typography>
    </div>
  );
};
