import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

export function Card({
  className = "",
  padding = "md",
  children,
  ...props
}: CardProps) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md my-4 ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
