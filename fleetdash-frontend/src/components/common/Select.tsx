import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={twMerge(
            clsx(
              'w-full bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 text-sm rounded-lg border border-gray-300 dark:border-dark-700 px-3.5 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-800',
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              className
            )
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500 dark:text-gray-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
