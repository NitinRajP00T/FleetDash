import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Page Not Found</h2>
      <p className="text-xs text-gray-500 max-w-sm">
        The route or telemetry module page you are looking for does not exist or has been moved.
      </p>
      <Button
        variant="primary"
        onClick={() => navigate('/dashboard')}
        leftIcon={<Home className="w-4 h-4" />}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};
