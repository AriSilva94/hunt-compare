"use client";

import { forwardRef } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { Typography } from "./Typography";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

// Registrar o locale brasileiro
registerLocale("pt-BR", ptBR);

interface DatePickerProps {
  label?: string;
  error?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = forwardRef<ReactDatePicker, DatePickerProps>(
  ({ className = "", label, error, value, onChange, placeholder = "Selecione uma data", disabled }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <Typography variant="small" as="label" className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-1">
              <span className="text-sm">📅</span>
              {label}
            </span>
          </Typography>
        )}
        
        <div className="relative">
          <ReactDatePicker
            ref={ref}
            selected={value}
            onChange={onChange}
            locale="pt-BR"
            dateFormat="dd/MM/yyyy"
            placeholderText={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 
              focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              shadow-sm hover:shadow-md focus:shadow-lg
              ${error 
                ? "border-red-500 dark:border-red-400 focus:ring-red-500/20 focus:border-red-500" 
                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }
              ${className}`}
            popperClassName="z-50"
            popperPlacement="bottom-start"
            showPopperArrow={false}
            calendarClassName="shadow-xl border-0 rounded-xl"
          />
        </div>

        {error && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-red-500 text-xs">⚠️</span>
            <Typography variant="small" className="text-red-600 dark:text-red-400">
              {error}
            </Typography>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";