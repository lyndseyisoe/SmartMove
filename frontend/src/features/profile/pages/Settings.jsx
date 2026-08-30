import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader, Input, Button, LoadingState } from '../../../components/ui';
import { fetchProfile, updateProfile, clearProfileError } from '../../profile/profileSlice';
import { useForm } from 'react-hook-form';

export default function Settings() {
  const dispatch = useDispatch();
  const { user, loading, updating, error } = useSelector((s) => s.profile);

  const {
    register: field,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      reset({ name: user.name || '', email: user.email || '' });
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    const result = await dispatch(updateProfile(values));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(clearProfileError());
    }
  };

  if (loading) return <LoadingState label="Loading profile..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Profile</h1>
        <p className="text-sm text-[var(--color-slate)]">Update your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[var(--color-navy)]">Account information</h2>
        </CardHeader>
        <CardBody>
          {error && <p className="mb-4 text-sm text-[#dc2626]">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input label="Full name" error={errors.name?.message} {...field('name')} />
            <Input label="Email" type="email" error={errors.email?.message} {...field('email')} />
            <div>
              <p className="text-xs text-[var(--color-slate)]">Role</p>
              <p className="text-sm font-medium text-[var(--color-navy)] capitalize">{user?.role}</p>
            </div>
            <Button type="submit" loading={updating}>Save changes</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
