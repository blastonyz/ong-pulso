import { enumTag } from "@/utils/format";

const colors: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700",
  Active: "bg-emerald-100 text-emerald-700",
  Paused: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
  Completed: "bg-blue-100 text-blue-700",
  Archived: "bg-zinc-100 text-zinc-700",
  Pending: "bg-slate-100 text-slate-700",
  Submitted: "bg-purple-100 text-purple-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: { tag: string } | string }) {
  const label = enumTag(status);
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[label] ?? colors.Draft}`}
    >
      {label}
    </span>
  );
}
