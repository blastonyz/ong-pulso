export function ProgressBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-surface-high">
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary-container to-primary transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
