import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoverJobs } from '../../mover/moverSlice';
import { Card, CardBody, LoadingState, EmptyState } from '../../../components/ui';
import { formatDate } from '../../../utils/format';

export default function MoverJobs() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((s) => s.mover);

  useEffect(() => {
    dispatch(fetchMoverJobs());
  }, [dispatch]);

  if (loading) return <LoadingState label="Loading jobs..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">My Jobs</h1>
        <p className="text-sm text-[var(--color-slate)]">Bookings assigned to you.</p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs yet" description="You have no assigned jobs right now." />
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-navy)]">Booking #{job.id}</p>
                  <p className="text-xs text-[var(--color-slate)]">{formatDate(job.moveDate)}</p>
                </div>
                <span className="text-sm capitalize text-[var(--color-slate)]">{job.status}</span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
