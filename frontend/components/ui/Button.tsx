import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "border border-primary/70 bg-primary text-on-primary shadow-[0_0_18px_rgba(137,206,255,0.18)] hover:bg-[#c9e6ff] disabled:border-outline disabled:bg-surface-high disabled:text-muted"
      : variant === "secondary"
        ? "border border-outline bg-surface-high text-foreground hover:bg-surface-highest disabled:text-muted"
        : "text-primary hover:bg-primary/10 disabled:text-muted";

  return (
    <button
      className={`rounded-lg px-4 py-2 font-mono text-sm font-medium tracking-[0.02em] transition active:scale-[0.98] disabled:cursor-not-allowed ${styles} ${className}`}
      {...props}
    />
  );
}
