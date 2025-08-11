"use client";

import React from "react";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
}

export function Checkbox({ 
  checked, 
  onCheckedChange, 
  className = "",
  disabled = false,
  id,
  label 
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  if (label) {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded 
            focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
            focus:ring-2 dark:bg-gray-700 dark:border-gray-600 
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
        />
        <label 
          htmlFor={id} 
          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={handleChange}
      disabled={disabled}
      className={`
        w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded 
        focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
        focus:ring-2 dark:bg-gray-700 dark:border-gray-600 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
}