import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, LoadingState, EmptyState, ErrorState } from '../../../components/ui';
import { fetchAdminReports } from '../../admin/adminSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminReports());
  }, [dispatch]);

  if (loading) return <LoadingState label="Loading reports..." />;
  if (error) return <ErrorState onAction={() => dispatch(fetchAdminReports())} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--color-slate)]">Overview of platform stats.</p>
      </div>

      {!reports ? (
        <EmptyState title="No reports available" description="Check back later." />
      ) : (
        <div className="flex flex-col gap-3">
          {Object.entries(reports).map(([key, value]) => (
            <Card key={key}>
              <CardBody className="flex flex-col gap-1">
                <p className="text-xs uppercase text-[var(--color-slate)]">{formatKey(key)}</p>
                <p className="text-xl font-bold text-[var(--color-navy)]">{value ?? '—'}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
