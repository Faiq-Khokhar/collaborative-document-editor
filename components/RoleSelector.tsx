"use client";
import { setRole } from "@/lib/state/slices/sessionSlice";
import { useAppDispatch, useAppSelector } from "@/lib/state/store";
import { Role } from "@/lib/types";
import { Typography } from "./Typography";
import { ROLES } from "@/lib/enums/role";

const labels: Record<Role, string> = {
  editor: ROLES.EDITOR,
  reviewer: ROLES.REVIEWER,
  viewer: ROLES.VIEWER,
};

export const RoleSelector = () => {
  const dispatch = useAppDispatch();
  const role = useAppSelector((s) => s.session.role);

  return (
    <div className="flex items-center gap-2">
      <Typography as="span" size="xs" tone="muted" className="uppercase tracking-wide">Role</Typography>
      <select
        value={role}
        onChange={(e) => dispatch(setRole(e.target.value as Role))}
        className="rounded-full border border-slate-200 bg-white text-slate-600 px-3 py-2 text-sm font-medium shadow-sm hover:border-slate-300 focus:outline-none"
      >
        {Object.entries(labels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
