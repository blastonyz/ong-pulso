import { type ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`glass-panel subtle-gradient rounded-2xl p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 border-b border-outline/70 pb-4">
      <h2 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm leading-5 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
