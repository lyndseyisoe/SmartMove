import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import { Button, Input } from '../../../components/ui';
import authApi from '../../../services/authApi';
import { resetPasswordSchema } from '../schemas';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(token ? '' : 'This reset link is missing or invalid.');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(resetPasswordSchema) });
  const onSubmit = async ({ password }) => { setError(''); try { await authApi.resetPassword(token, password); setDone(true); } catch (err) { setError(err.response?.data?.error || 'This reset link is invalid or has expired.'); } };
  return <AuthLayout title="Set a new password" subtitle="Choose a strong password for your SmartMove account." footer={<>Remembered it? <Link to="/login" className="font-medium text-[var(--color-teal-dark)] hover:underline">Log in</Link></>}>
    {done ? <div className="space-y-4"><div className="rounded-2xl bg-[var(--color-teal-light)] p-5 text-sm leading-6 text-[var(--color-teal-dark)]">Your password has been reset successfully.</div><Button as={Link} to="/login" className="w-full">Continue to login</Button></div> : <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">{error && <p className="rounded-lg bg-[#fde8e8] px-3.5 py-2.5 text-sm text-[#dc2626]">{error}</p>}<Input label="New password" type="password" placeholder="At least 8 characters" error={errors.password?.message} {...register('password')} /><Input label="Confirm password" type="password" placeholder="Repeat your new password" error={errors.confirmPassword?.message} {...register('confirmPassword')} /><Button type="submit" loading={isSubmitting} disabled={!token} className="mt-2 w-full">Reset password</Button></form>}
  </AuthLayout>;
}
