import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'w-full bg-white dark:bg-dark-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm rounded-lg border border-gray-300 dark:border-dark-700 px-3.5 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-dark-800',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-gray-400 dark:text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-gray-500 dark:text-gray-400">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
