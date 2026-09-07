import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '../AuthLayout';
import { Input, Button } from '../../../components/ui';
import { login, clearAuthError } from '../authSlice';
import { loginSchema } from '../schemas';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((s) => s.auth.authError);
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    dispatch(clearAuthError());
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      navigate('/client/dashboard');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep your move on track."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-[var(--color-teal-dark)] hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {authError && (
          <div className="rounded-lg bg-[#fde8e8] px-3.5 py-2.5 text-sm text-[#dc2626]">{authError}</div>
        )}
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...field('email')} />
        <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...field('password')} />
        <Link to="/forgot-password" className="-mt-2 self-end text-xs font-medium text-[var(--color-teal-dark)] hover:underline">Forgot password?</Link>
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
