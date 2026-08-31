import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import { Button, Input } from '../../../components/ui';
import authApi from '../../../services/authApi';
import { forgotPasswordSchema } from '../schemas';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(forgotPasswordSchema) });
  const onSubmit = async ({ email }) => { setError(''); try { await authApi.forgotPassword(email); setSent(true); } catch (err) { setError(err.response?.data?.error || 'Unable to send the reset email. Please try again.'); } };
  return <AuthLayout title="Forgot your password?" subtitle="Enter your email and we’ll send you a secure reset link." footer={<>Remember your password? <Link to="/login" className="font-medium text-[var(--color-teal-dark)] hover:underline">Log in</Link></>}>
    {sent ? <div className="rounded-2xl bg-[var(--color-teal-light)] p-5 text-sm leading-6 text-[var(--color-teal-dark)]">If an account exists for that email, we’ve sent a reset link. Check your inbox and spam folder. The link expires in 30 minutes.</div> : <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">{error && <p className="rounded-lg bg-[#fde8e8] px-3.5 py-2.5 text-sm text-[#dc2626]">{error}</p>}<Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} /><Button type="submit" loading={isSubmitting} className="mt-2 w-full">Send reset link</Button></form>}
  </AuthLayout>;
}
