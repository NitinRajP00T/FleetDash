import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from '../components/common/Breadcrumb';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Sub-header Breadcrumb Bar */}
        <div className="px-6 py-3 bg-white/50 dark:bg-dark-900/50 border-b border-gray-100 dark:border-dark-800/60 backdrop-blur-xs flex items-center justify-between">
          <Breadcrumb />
        </div>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
