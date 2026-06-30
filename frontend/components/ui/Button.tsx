import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-800 disabled:bg-slate-400"
      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 disabled:text-slate-400";

  return (
    <button
      className={`rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${styles} ${className}`}
      {...props}
    />
  );
}
