import { enumTag } from "@/utils/format";

const colors: Record<string, string> = {
  Draft: "border-slate-500/30 bg-slate-400/10 text-slate-200",
  Active: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Paused: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Cancelled: "border-red-400/30 bg-red-400/10 text-red-300",
  Completed: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Archived: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
  Pending: "border-slate-500/30 bg-slate-400/10 text-slate-200",
  Submitted: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Rejected: "border-red-400/30 bg-red-400/10 text-red-300",
};

export function StatusBadge({ status }: { status: { tag: string } | string }) {
  const label = enumTag(status);
  return (
    <span
      className={`rounded-full border px-3 py-1 font-mono text-xs font-medium tracking-[0.04em] ${colors[label] ?? colors.Draft}`}
    >
      {label}
    </span>
  );
}
