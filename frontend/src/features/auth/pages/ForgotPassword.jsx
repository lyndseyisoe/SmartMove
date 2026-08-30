import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Card, CardBody, Input, Button, EmptyState } from '../../../components/ui';
import authApi from '../../../services/authApi';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    setError(null);
    try {
      await authApi.forgotPassword(values);
      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardBody className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-[var(--color-navy)]">Reset your password</h1>
            <p className="text-sm text-[var(--color-slate)]">Enter your email and we'll send you a reset link.</p>
          </div>

          {sent ? (
            <EmptyState icon={Mail} title="Check your email" description="If an account exists, a reset link has been sent." />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {error && <p className="text-sm text-[#dc2626]">{error}</p>}
              <Input label="Email" type="email" error={errors.email?.message} {...field('email')} />
              <Button type="submit" loading={isSubmitting} className="w-full">Send reset link</Button>
            </form>
          )}

          <p className="text-center text-sm text-[var(--color-slate)]">
            Remember your password? <Link to="/login" className="font-medium text-[var(--color-teal-dark)]">Log in</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
