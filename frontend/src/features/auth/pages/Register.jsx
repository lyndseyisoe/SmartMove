import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '../AuthLayout';
import { Input, Select, Button } from '../../../components/ui';
import { register as registerUser, clearAuthError } from '../authSlice';
import { registerSchema } from '../schemas';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authError = useSelector((s) => s.auth.authError);
  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), defaultValues: { role: 'client' } });

  const onSubmit = async (values) => {
    dispatch(clearAuthError());
    const result = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(result)) {
      navigate('/client/dashboard');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Get a quote and book a mover in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[var(--color-teal-dark)] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {authError && (
          <div className="rounded-lg bg-[#fde8e8] px-3.5 py-2.5 text-sm text-[#dc2626]">{authError}</div>
        )}
        <Input label="Full name" placeholder="Jane Wanjiru" error={errors.name?.message} {...field('name')} />
        <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...field('email')} />
        <Input label="Password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...field('password')} />
        <Input label="Confirm password" type="password" error={errors.confirmPassword?.message} {...field('confirmPassword')} />
        <Select label="Role" error={errors.role?.message} {...field('role')}>
          <option value="client">Client</option>
          <option value="mover">Mover</option>
          <option value="admin">Admin</option>
        </Select>
        <Button type="submit" loading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
