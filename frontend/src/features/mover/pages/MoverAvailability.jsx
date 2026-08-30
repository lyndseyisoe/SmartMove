import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader, Button, LoadingState } from '../../../components/ui';
import { fetchMoverDashboard, updateMoverAvailability } from '../../mover/moverSlice';

export default function MoverAvailability() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((s) => s.mover);
  const [saving, setSaving] = useState(false);

  const isAvailable = dashboard?.user?.is_available ?? true;

  useEffect(() => {
    dispatch(fetchMoverDashboard());
  }, [dispatch]);

  const toggle = async () => {
    setSaving(true);
    await dispatch(updateMoverAvailability({ is_available: !isAvailable }));
    setSaving(false);
  };

  if (loading) return <LoadingState label="Loading availability..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Availability</h1>
        <p className="text-sm text-[var(--color-slate)]">Control whether you appear in mover listings.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[var(--color-navy)]">Current status</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <p className="text-sm text-[var(--color-slate)]">
            You are currently <span className="font-medium text-[var(--color-navy)]">{isAvailable ? 'available' : 'unavailable'}</span> for new jobs.
          </p>
          <Button onClick={toggle} loading={saving} variant={isAvailable ? 'danger' : 'primary'}>
            {isAvailable ? 'Go unavailable' : 'Go available'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
