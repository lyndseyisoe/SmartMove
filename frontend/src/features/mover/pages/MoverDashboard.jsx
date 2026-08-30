import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoverDashboard } from '../../mover/moverSlice';
import { Card, CardBody, LoadingState } from '../../../components/ui';
import { BarChart3, Briefcase, Clock } from 'lucide-react';

export default function MoverDashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((s) => s.mover);

  useEffect(() => {
    dispatch(fetchMoverDashboard());
  }, [dispatch]);

  if (loading) return <LoadingState label="Loading mover dashboard..." />;

  const stats = dashboard?.stats || {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Mover Dashboard</h1>
        <p className="text-sm text-[var(--color-slate)]">Overview of your work.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Briefcase} label="Total jobs" value={stats.totalJobs ?? '—'} />
        <StatCard icon={Clock} label="Pending jobs" value={stats.pendingJobs ?? '—'} />
        <StatCard icon={BarChart3} label="Completed" value={stats.completedJobs ?? '—'} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-teal-light)] text-[var(--color-teal-dark)]">
          <Icon className="size-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-navy)]">{value}</p>
          <p className="text-xs text-[var(--color-slate)]">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}
