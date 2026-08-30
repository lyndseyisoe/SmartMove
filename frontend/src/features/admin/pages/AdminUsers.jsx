import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../admin/adminSlice';
import { Card, CardBody, LoadingState, EmptyState, ErrorState } from '../../../components/ui';

export default function AdminUsers() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  if (loading) return <LoadingState label="Loading users..." />;
  if (error) return <ErrorState onAction={() => dispatch(fetchAdminUsers())} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)]">Users</h1>
        <p className="text-sm text-[var(--color-slate)]">All registered users.</p>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" description="There are no registered users yet." />
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <Card key={u.id}>
              <CardBody className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--color-navy)]">{u.name}</p>
                  <p className="text-xs text-[var(--color-slate)]">{u.email}</p>
                </div>
                <span className="text-sm capitalize text-[var(--color-slate)]">{u.role}</span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
