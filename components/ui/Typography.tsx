import { ReactNode } from "react";
import { cn } from "@/utils/cn";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "small"
  | "caption"
  | "lead"
  | "muted";

type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: TypographyElement;
  className?: string;
  children: ReactNode;
}

const typographyVariants = {
  h1: "text-4xl font-bold text-gray-900 dark:text-white",
  h2: "text-3xl font-bold text-gray-900 dark:text-white",
  h3: "text-2xl font-semibold text-gray-900 dark:text-white",
  h4: "text-xl font-semibold text-gray-900 dark:text-white",
  p: "text-base text-gray-700 dark:text-white",
  small: "text-sm text-gray-600 dark:text-gray-400",
  caption: "text-xs text-gray-500 dark:text-gray-300",
  lead: "text-lg text-gray-700 dark:text-gray-300 font-medium",
  muted: "text-sm text-gray-500 dark:text-gray-500",
};

const defaultElements: Record<TypographyVariant, TypographyElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  small: "span",
  caption: "span",
  lead: "p",
  muted: "p",
};

export function Typography({
  variant = "p",
  as,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as || defaultElements[variant];

  return (
    <Component
      className={cn(typographyVariants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
