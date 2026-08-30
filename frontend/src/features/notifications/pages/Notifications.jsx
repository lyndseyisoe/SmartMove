import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../../notifications/notificationsSlice';
import { Card, CardBody, LoadingState, EmptyState, Button } from '../../../components/ui';
import { Bell, Check } from 'lucide-react';

export default function Notifications() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  if (loading) return <LoadingState label="Loading notifications..." />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Notifications</h1>
        <p className="text-sm text-[var(--color-slate)]">Stay updated.</p>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((n) => (
            <Card key={n.id} className={n.read ? 'opacity-70' : 'border-[var(--color-teal)]'}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[var(--color-navy)]">{n.message}</p>
                  <p className="text-xs text-[var(--color-slate)]">{n.type} • {n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p>
                </div>
                {!n.read && (
                  <Button size="sm" variant="ghost" onClick={() => dispatch(markNotificationRead(n.id))}>
                    <Check className="size-4" />
                  </Button>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
