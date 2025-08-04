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
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/50 my-4 theme-transition ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
