import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Lock, Mail } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@fleetdash.com',
      password: 'Password123!',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      setAuth(res.user, res.tokens.accessToken, res.tokens.refreshToken);
      toast.success(`Welcome back, ${res.user.firstName}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: string, email: string) => {
    setValue('email', email);
    setValue('password', 'Password123!');
    toast.success(`Set demo credentials for ${role}`);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@fleetdash.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Password@123"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={loading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Sign In to Dashboard
        </Button>
      </form>

      {/* Quick Demo Login Preset Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-800">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 text-center">
          Quick Demo Login Presets
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDemoCredentials('Super Admin', 'superadmin@fleetdash.com')}
          >
            Super Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDemoCredentials('Fleet Manager', 'manager@fleetdash.com')}
          >
            Fleet Manager
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDemoCredentials('Dispatcher', 'dispatcher@fleetdash.com')}
          >
            Dispatcher
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDemoCredentials('Analyst', 'analyst@fleetdash.com')}
          >
            Analyst
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};
