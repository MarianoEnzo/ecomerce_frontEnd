import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../features/auth/auth.api';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
  setServerError('');
  setLoading(true);
  try {
    const { access_token } = await authApi.register(data.email, data.password);
    
    // Llamar a /users/me con el token directamente en el header
    const user = await authApi.me(access_token);
    setAuth(access_token, user);
    navigate('/');
  } catch (err: any) {
    // ...
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">

        <div className="mb-10">
          <Link to="/" className="font-serif text-2xl text-foreground">
            URBN
          </Link>
          <h1 className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
            Create Account
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              placeholder="your@email.com"
            />
            {errors.email && (
              <span className="text-[10px] text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              autoComplete="new-password"
              className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-[10px] text-red-500">{errors.password.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              autoComplete="new-password"
              className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <span className="text-[10px] text-red-500">{errors.confirmPassword.message}</span>
            )}
          </div>

          {serverError && (
            <p className="text-[11px] text-red-500">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-foreground py-3.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <p className="mt-8 text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground underline underline-offset-2">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}