// components/ui.tsx
import React, { CSSProperties, ButtonHTMLAttributes } from "react";

export function Card({
  children,
  style,
}: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div className="glass" style={{ padding: 20, ...(style || {}) }}>
      {children}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="badge">
      <span className="dot" />
      {children}
    </span>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ children, variant = "primary", ...props }: ButtonProps) {
  const cls = `btn ${variant === "ghost" ? "btn-ghost" : "btn-primary"}`;
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
