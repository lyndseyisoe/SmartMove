import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminMovers, approveMover } from '../../admin/adminSlice';
import { Card, CardBody, Button, LoadingState, EmptyState, ErrorState } from '../../../components/ui';

export default function AdminMovers() {
  const dispatch = useDispatch();
  const { movers, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminMovers());
  }, [dispatch]);

  if (loading) return <LoadingState label="Loading movers..." />;
  if (error) return <ErrorState onAction={() => dispatch(fetchAdminMovers())} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Movers</h1>
        <p className="text-sm text-[var(--color-slate)]">Manage mover accounts.</p>
      </div>

      {movers.length === 0 ? (
        <EmptyState title="No movers found" description="There are no mover accounts yet." />
      ) : (
        <div className="flex flex-col gap-3">
          {movers.map((m) => (
            <Card key={m.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-navy)]">{m.name}</p>
                  <p className="text-xs text-[var(--color-slate)]">{m.email}</p>
                </div>
                {!m.is_approved && (
                  <Button size="sm" onClick={() => dispatch(approveMover(m.id))}>Approve</Button>
                )}
                {m.is_approved && <span className="text-xs text-[var(--color-teal-dark)]">Approved</span>}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
