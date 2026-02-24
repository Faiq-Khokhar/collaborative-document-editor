export const TimeCell = ({ ts, mounted }: { ts?: number; mounted: boolean }) =>
  mounted && ts ? (
    <span>
      {new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  ) : (
    <span
      className="inline-block h-3 w-12 rounded bg-slate-200/80 align-middle animate-pulse"
      aria-hidden
    />
  );
