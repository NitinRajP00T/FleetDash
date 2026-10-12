import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  variant?: 'active' | 'inactive' | 'maintenance' | 'read' | 'resolved' | 'low' | 'medium' | 'high' | 'critical' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'default';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className }) => {
  const variantStyles: Record<string, string> = {
    active: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    read: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    resolved: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800',
    inactive: 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-dark-700',
    maintenance: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    low: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    medium: 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    high: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    critical: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse',
    scheduled: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800',
    in_progress: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    completed: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    cancelled: 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-dark-700',
    default: 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-700',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
          variantStyles[variant] || variantStyles.default,
          className
        )
      )}
    >
      {children}
    </span>
  );
};
