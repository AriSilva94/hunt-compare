import { InputHTMLAttributes, forwardRef } from "react";
import { Typography } from "@/components/ui/Typography";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Typography variant="small" as="label" className="block font-medium mb-1">
            {label}
          </Typography>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
            error ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"
          } ${className}`}
          {...props}
        />
        {error && <Typography variant="small" className="mt-1 text-red-600 dark:text-red-400">{error}</Typography>}
      </div>
    );
  }
);

Input.displayName = "Input";
