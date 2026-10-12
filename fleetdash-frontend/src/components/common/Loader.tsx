import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      <Loader2 className={`${sizes[size]} animate-spin text-brand-600 dark:text-brand-400`} />
      {text && <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
};

export const FullPageLoader: React.FC<{ text?: string }> = ({ text = 'Loading FleetDash...' }) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-dark-950/80 backdrop-blur-xs flex items-center justify-center z-50">
      <Loader size="lg" text={text} />
    </div>
  );
};
