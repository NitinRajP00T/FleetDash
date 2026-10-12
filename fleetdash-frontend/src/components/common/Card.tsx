import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-dark-900 border border-gray-100 dark:border-dark-800/80 rounded-2xl p-5 shadow-xs transition-all duration-200',
          hoverEffect && 'hover:shadow-md hover:border-gray-200 dark:hover:border-dark-700',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
