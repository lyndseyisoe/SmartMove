import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardBody, Input, Button, EmptyState } from '../../../components/ui';
import { Mail } from 'lucide-react';
import authApi from '../../../services/authApi';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const {
    register: field,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    setError(null);
    try {
      await authApi.resetPassword({ ...values, token });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardBody className="flex flex-col gap-4 text-center">
            <h1 className="text-xl font-bold text-[var(--color-navy)]">Invalid link</h1>
            <p className="text-sm text-[var(--color-slate)]">The password reset link is invalid or has expired.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardBody className="flex flex-col gap-4">
          {done ? (
            <EmptyState icon={Mail} title="Password updated" description="Redirecting to login..." />
          ) : (
            <>
              <div className="text-center">
                <h1 className="text-xl font-bold text-[var(--color-navy)]">Set a new password</h1>
                <p className="text-sm text-[var(--color-slate)]">Enter your new password below.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {error && <p className="text-sm text-[#dc2626]">{error}</p>}
                <Input label="New password" type="password" error={errors.password?.message} {...field('password')} />
                <Button type="submit" loading={isSubmitting} className="w-full">Update password</Button>
              </form>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
