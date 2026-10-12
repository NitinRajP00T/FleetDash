import React from 'react';
import { Truck } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-dark-950 p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-dark-900 border border-gray-100 dark:border-dark-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            FleetDash
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enterprise Fleet Telemetry & Operations Platform
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};
