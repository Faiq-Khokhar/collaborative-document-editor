"use client";
import { useAppDispatch, useAppSelector } from "@/lib/state/store";
import { setOffline } from "@/lib/state/slices/connectionSlice";

export const OfflineToggle = () => {
  const dispatch = useAppDispatch();
  const offline = useAppSelector((s) => s.connection.offline);

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        checked={offline}
        onChange={(e) => dispatch(setOffline(e.target.checked))}
        className="peer h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
      />
      <span className="peer-checked:text-sky-700">Offline mode</span>
    </label>
  );
};
